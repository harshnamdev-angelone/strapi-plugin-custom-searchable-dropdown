// import { useFetchClient } from "@strapi/helper-plugin";
import { getFromLocalStorage, addToLocalStorage } from "./cache";
import { indexToSegmentMapping } from "./constants";
import { isFetchingData } from "./globalFlags";

// Function to check if fetchData is currently running
function checkIsFetchingData() {
  if (isFetchingData) {
    console.log("fetchData is already running, skipping this call.");
    return true;
  }
  return false;
}

function sortByExpDateAndSumbol(data) {
  // Sort the array based on sSymbol
  data.sort((a, b) => a.sSymbol.localeCompare(b.sSymbol));

  // Create two sub-arrays for objects with duplicate and unique ExpDate values
  const duplicateExpDates = {};
  const uniqueExpDates = {};

  data.forEach((obj) => {
    if (!uniqueExpDates[obj.sSymbol]) {
      uniqueExpDates[obj.sSymbol] = [];
      uniqueExpDates[obj.sSymbol].push(obj);
    } else if (!isExpDateUnique(uniqueExpDates, obj.sSymbol, obj.ExpDate)) {
      uniqueExpDates[obj.sSymbol].push(obj);
    } else {
      if (!duplicateExpDates[obj.sSymbol]) {
        duplicateExpDates[obj.sSymbol] = [];
      }
      duplicateExpDates[obj.sSymbol].push(obj);
    }
  });

  const mergedArray = [];

  // Iterate over uniqueExpDates
  for (const sSymbol in uniqueExpDates) {
    mergedArray.push(...uniqueExpDates[sSymbol]);
    if (duplicateExpDates[sSymbol]) {
      mergedArray.push(...duplicateExpDates[sSymbol]);
    }
  }

  console.log("returning sorted data");
  return mergedArray;
}

function isExpDateUnique(uniqueExpDates, sSymbol, expDate) {
  // If the sSymbol exists in uniqueExpDates array
  const expDates = uniqueExpDates[sSymbol].map((obj) => obj.ExpDate);
  return expDates.includes(expDate);
}

async function fetchData(fetchApi) {
  console.log("fetching data...");

  // Check if fetchData is already running
  if (checkIsFetchingData()) {
    console.log("fetchData is already running, skipping this call.");
    return;
  }

  try {
    // Set the flag to true to indicate that fetchData is running
    isFetchingData = true;

    // Make parallel calls to fetch data
    const fetchRequestsList = [];

    const checkAndPushFetchRequest = (index, instrumentType, optionType) => {
      if (
        getFromLocalStorage(indexToSegmentMapping[index], false).length === 0
      ) {
        if (instrumentType == "cash") {
          fetchRequestsList.push(
            fetchApi.get(
              "/content-manager/collection-types/api::amx-scrip-master.amx-scrip-master",
              {
                params: {
                  pageSize: 50000,
                  fields:
                    "ntradesymbol,sSymbol,nStrikePrice,nInstrumentType,astCls,ExpDate",
                  "filters[$and][0][astCls][$eq]": "cash",
                  sort: "ntradesymbol:ASC",
                },
              }
            )
          );
        } else {
          fetchRequestsList.push(
            fetchApi.get(
              "/content-manager/collection-types/api::amx-scrip-master.amx-scrip-master",
              {
                params: {
                  pageSize: 50000,
                  fields:
                    "ntradesymbol,sSymbol,nStrikePrice,nInstrumentType,astCls,ExpDate",
                  "filters[$and][0][nInstrumentType][$eq]": instrumentType,
                  "filters[$and][1][sOptionType][$eq]": optionType,
                  sort: "ntradesymbol:ASC",
                },
              }
            )
          );
        }
      }
    };

    // Get the keys of the indexToSegmentMapping
    const keys = Object.keys(indexToSegmentMapping);

    let index;
    // Loop through indexToSegmentMapping to avoid repetition
    keys.forEach((indexS) => {
      index = parseInt(indexS);
      switch (parseInt(index)) {
        case 0:
        case 1:
          checkAndPushFetchRequest(index, "OPTSTK", index === 0 ? "PE" : "CE");
          break;
        case 2:
        case 3:
          checkAndPushFetchRequest(index, "OPTIDX", index === 2 ? "PE" : "CE");
          break;
        case 4:
        case 5:
          checkAndPushFetchRequest(index, "OPTFUT", index === 4 ? "PE" : "CE");
          break;
        case 6:
        case 7:
          checkAndPushFetchRequest(index, "OPTCUR", index === 6 ? "PE" : "CE");
          break;
        case 8:
          checkAndPushFetchRequest(index, "FUTSTK");
          break;
        case 9:
          checkAndPushFetchRequest(index, "FUTIDX");
          break;
        case 10:
          checkAndPushFetchRequest(index, "FUTCUR");
          break;
        case 11:
          checkAndPushFetchRequest(index, "FUTCOM");
          break;
        case 12:
          checkAndPushFetchRequest(index, "cash");
          break;
        default:
          break;
      }
    });

    const startTime = Date.now();
    const pageResponses = await Promise.all(fetchRequestsList);
    const endTime = Date.now();
    const latency = endTime - startTime;
    console.log("all promises resolved... latency: ", latency);

    pageResponses.forEach((response, i) => {
      if (response.data && response.data.results) {
        var data = response.data.results.map((entry) => ({
          ntradesymbol: entry.ntradesymbol,
          sSymbol: entry.sSymbol,
          nStrikePrice: entry.nStrikePrice,
          nInstrumentType: entry.nInstrumentType,
          astCls: entry.astCls,
          ExpDate: entry.ExpDate,
        }));

        console.log("i: ", i, " data.len: ", data.length);

        // for equity segment strike price don't exists
        if (i !== 12) {
          data = sortByExpDateAndSumbol(data);
        }

        // add to cache
        addToLocalStorage(
          indexToSegmentMapping[i],
          data.map((entry) => entry.ntradesymbol)
        );
      } else {
        console.error(
          "Error fetching data: Data is not in the expected format"
        );
      }
    });
    // Reset the flag to false
    isFetchingData = false;
  } catch (err) {
    console.error("Error fetching data:", err);
    // Reset the flag to false in case of an error
    isFetchingData = false;
  }
}

export { fetchData, checkIsFetchingData };
