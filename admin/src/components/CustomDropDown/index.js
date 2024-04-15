import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";
import { Combobox, ComboboxOption } from "@strapi/design-system/Combobox";
import { Stack } from "@strapi/design-system/Stack";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldHint,
} from "@strapi/design-system/Field";
import { useIntl } from "react-intl";
import {
  useFetchClient,
  useCMEditViewDataManager,
} from "@strapi/helper-plugin";

// NOTE: do not change this mapping
const indexToSegmentMapping = {
  0: "StockOptionPE",
  1: "StockOptionCE",
  2: "IndexOptionPE",
  3: "IndexOptionCE",
  4: "CommodityOptionPE",
  5: "CommodityOptionCE",
  6: "CurrencyOptionPE",
  7: "CurrencyOptionCE",
  8: "StockFuture",
  9: "FutureIndex",
  10: "CurrencyFuture",
  11: "FutureCommodity",
  12: "Equity",
};

// Initialize an empty Map
const cacheMap = new Map();

// Add data to the cache
function addToCache(key, data) {
  cacheMap.set(key, data);
}

// Retrieve data from the cache
function getFromCache(key) {
  return cacheMap.get(key) || [];
}

const CustomDropDown = React.forwardRef(
  (
    {
      value,
      onChange,
      name,
      intlLabel,
      labelAction,
      required,
      attribute,
      description,
      placeholder,
      disabled,
    },
    forwardedRef
  ) => {
    const { formatMessage, messages } = useIntl();
    const [typedTradeSymbol, setTypedTradeSymbol] = useState("");
    const [parsedOptionsNt, setNTradeSymbols] = useState([
      "Type atleast 3 chars",
    ]);
    let prevStateInstrumentType = "";
    let prevTypedTradeSymbol = "";

    const fetchApi = useFetchClient();
    const { modifiedData } = useCMEditViewDataManager();

    useEffect(() => {
      console.log("use effect 1 .. ");

      const fetchData = async () => {
        try {
          // Make parallel calls to fetch data
          const fetchRequestsList = [];

          // 0: Stock Option PE
          fetchRequestsList.push(
            fetchApi.get(
              "/content-manager/collection-types/api::amx-scrip-master.amx-scrip-master",
              {
                params: {
                  pageSize: 50000,
                  fields:
                    "ntradesymbol,sSymbol,nStrikePrice,nInstrumentType,astCls,ExpDate",
                  "filters[$and][0][nInstrumentType][$eq]": "OPTSTK",
                  "filters[$and][1][sOptionType][$eq]": "PE",
                  sort: "ntradesymbol:ASC",
                },
              }
            )
          );

          // 1: Stock Option CE
          fetchRequestsList.push(
            fetchApi.get(
              "/content-manager/collection-types/api::amx-scrip-master.amx-scrip-master",
              {
                params: {
                  pageSize: 50000,
                  fields:
                    "ntradesymbol,sSymbol,nStrikePrice,nInstrumentType,astCls,ExpDate",
                  "filters[$and][0][nInstrumentType][$eq]": "OPTSTK",
                  "filters[$and][1][sOptionType][$eq]": "CE",
                  sort: "ntradesymbol:ASC",
                },
              }
            )
          );

          // 2: Index Option PE
          fetchRequestsList.push(
            fetchApi.get(
              "/content-manager/collection-types/api::amx-scrip-master.amx-scrip-master",
              {
                params: {
                  pageSize: 50000,
                  fields:
                    "ntradesymbol,sSymbol,nStrikePrice,nInstrumentType,astCls,ExpDate",
                  "filters[$and][0][nInstrumentType][$eq]": "OPTIDX",
                  "filters[$and][1][sOptionType][$eq]": "PE",
                  sort: "ntradesymbol:ASC",
                },
              }
            )
          );

          // 3: Index Option CE
          fetchRequestsList.push(
            fetchApi.get(
              "/content-manager/collection-types/api::amx-scrip-master.amx-scrip-master",
              {
                params: {
                  pageSize: 50000,
                  fields:
                    "ntradesymbol,sSymbol,nStrikePrice,nInstrumentType,astCls,ExpDate",
                  "filters[$and][0][nInstrumentType][$eq]": "OPTIDX",
                  "filters[$and][1][sOptionType][$eq]": "CE",
                  sort: "ntradesymbol:ASC",
                },
              }
            )
          );

          // 4: Commodity Option PE
          fetchRequestsList.push(
            fetchApi.get(
              "/content-manager/collection-types/api::amx-scrip-master.amx-scrip-master",
              {
                params: {
                  pageSize: 50000,
                  fields:
                    "ntradesymbol,sSymbol,nStrikePrice,nInstrumentType,astCls,ExpDate",
                  "filters[$and][0][nInstrumentType][$eq]": "OPTFUT",
                  "filters[$and][1][sOptionType][$eq]": "PE",
                  sort: "ntradesymbol:ASC",
                },
              }
            )
          );

          // 5: Commodity Option CE
          fetchRequestsList.push(
            fetchApi.get(
              "/content-manager/collection-types/api::amx-scrip-master.amx-scrip-master",
              {
                params: {
                  pageSize: 50000,
                  fields:
                    "ntradesymbol,sSymbol,nStrikePrice,nInstrumentType,astCls,ExpDate",
                  "filters[$and][0][nInstrumentType][$eq]": "OPTFUT",
                  "filters[$and][1][sOptionType][$eq]": "CE",
                  sort: "ntradesymbol:ASC",
                },
              }
            )
          );

          // 6: Currency Option PE
          fetchRequestsList.push(
            fetchApi.get(
              "/content-manager/collection-types/api::amx-scrip-master.amx-scrip-master",
              {
                params: {
                  pageSize: 50000,
                  fields:
                    "ntradesymbol,sSymbol,nStrikePrice,nInstrumentType,astCls,ExpDate",
                  "filters[$and][0][nInstrumentType][$eq]": "OPTCUR",
                  "filters[$and][1][sOptionType][$eq]": "PE",
                  sort: "ntradesymbol:ASC",
                },
              }
            )
          );

          // 7: Currency Option CE
          fetchRequestsList.push(
            fetchApi.get(
              "/content-manager/collection-types/api::amx-scrip-master.amx-scrip-master",
              {
                params: {
                  pageSize: 50000,
                  fields:
                    "ntradesymbol,sSymbol,nStrikePrice,nInstrumentType,astCls,ExpDate",
                  "filters[$and][0][nInstrumentType][$eq]": "OPTCUR",
                  "filters[$and][1][sOptionType][$eq]": "CE",
                  sort: "ntradesymbol:ASC",
                },
              }
            )
          );

          // 8: Stock Future
          fetchRequestsList.push(
            fetchApi.get(
              "/content-manager/collection-types/api::amx-scrip-master.amx-scrip-master",
              {
                params: {
                  pageSize: 50000,
                  fields:
                    "ntradesymbol,sSymbol,nStrikePrice,nInstrumentType,astCls,ExpDate",
                  "filters[$and][0][nInstrumentType][$eq]": "FUTSTK",
                  sort: "ntradesymbol:ASC",
                },
              }
            )
          );

          // 9: Future Index
          fetchRequestsList.push(
            fetchApi.get(
              "/content-manager/collection-types/api::amx-scrip-master.amx-scrip-master",
              {
                params: {
                  pageSize: 50000,
                  fields:
                    "ntradesymbol,sSymbol,nStrikePrice,nInstrumentType,astCls,ExpDate",
                  "filters[$and][0][nInstrumentType][$eq]": "FUTIDX",
                  sort: "ntradesymbol:ASC",
                },
              }
            )
          );

          // 10: Currency Future
          fetchRequestsList.push(
            fetchApi.get(
              "/content-manager/collection-types/api::amx-scrip-master.amx-scrip-master",
              {
                params: {
                  pageSize: 50000,
                  fields:
                    "ntradesymbol,sSymbol,nStrikePrice,nInstrumentType,astCls,ExpDate",
                  "filters[$and][0][nInstrumentType][$eq]": "FUTCUR",
                  sort: "ntradesymbol:ASC",
                },
              }
            )
          );

          // 11: Future Commodity
          fetchRequestsList.push(
            fetchApi.get(
              "/content-manager/collection-types/api::amx-scrip-master.amx-scrip-master",
              {
                params: {
                  pageSize: 50000,
                  fields:
                    "ntradesymbol,sSymbol,nStrikePrice,nInstrumentType,astCls,ExpDate",
                  "filters[$and][0][nInstrumentType][$eq]": "FUTCOM",
                  sort: "ntradesymbol:ASC",
                },
              }
            )
          );

          // 12: Equity
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

          const startTime = Date.now();
          const pageResponses = await Promise.all(fetchRequestsList);
          const endTime = Date.now();
          const latency = endTime - startTime;
          console.log("all promises resolved... latency: ", latency);

          pageResponses.forEach((response, i) => {
            if (response.data && response.data.results) {
              let data = response.data.results.map((entry) => ({
                ntradesymbol: entry.ntradesymbol,
                sSymbol: entry.sSymbol,
                nStrikePrice: entry.nStrikePrice,
                nInstrumentType: entry.nInstrumentType,
                astCls: entry.astCls,
                ExpDate: entry.ExpDate,
              }));

              console.log("data.len...", data.length);

              // for equity segment strike price don't exists
              if (i !== 12) {
                data = sortByExpDateAndSumbol(data);
                const endTime = Date.now();
                const latency = endTime - startTime;
                console.log("sorting done... latency: ", latency);
              }

              // add to cache
              addToCache(indexToSegmentMapping[i], data);
            } else {
              console.error(
                "Error fetching data: Data is not in the expected format"
              );
            }
          });

        } catch (err) {
          console.error("Error fetching data:", err);
        }
      };

      fetchData();
    }, []);

    useEffect(() => {
      const instrument_type = modifiedData.instrument_type;

      // If instrument_type doesn't exist in modifiedData, return an empty array
      if (!instrument_type) {
        console.log("instrument_type key does not exist. Returning...");
        return;
      }
      // is instrument type is present but not 3 chars then reset dropdown
      setNTradeSymbols(["type atleast 3 chars"]);
      if (typedTradeSymbol.length < 3) {
        console.log("typedTradeSymbol < 3. Returning...");
        return;
      }
      // check if same request combination already processed
      if (
        prevStateInstrumentType === instrument_type &&
        prevTypedTradeSymbol === typedTradeSymbol
      ) {
        return;
      }

      // get data array from cache
      const dataArray = getFromCache(instrument_type);
      console.log("before filter dataArray len: ", dataArray.length);
      // for given instrument_type and filter based ntradeSymbol starts with typedTradeSymbol
      const dataArrayF = dataArray.filter((obj) =>
        obj.ntradesymbol.toLowerCase().startsWith(typedTradeSymbol)
      );
      console.log("after filter datagitArray len: ", dataArrayF.length);

      if (dataArrayF.length > 0) {
        // Extract ntradesymbol values from dataArray and Update parsedOptionsNt state
        setNTradeSymbols(dataArrayF.map((entry) => entry.ntradesymbol));
      } else {
        setNTradeSymbols(["no result found"]);
      }

      // set previous state of instrument_type
      prevStateInstrumentType = instrument_type;
      prevTypedTradeSymbol = typedTradeSymbol;
    }, [modifiedData, typedTradeSymbol]);

    const handleKeyPress = (event) => {
      setTypedTradeSymbol(event.target.value.toLowerCase());
    };

    return (
      <Field
        name={name}
        id={name}
        required={required}
        hint={description && formatMessage(description)}
      >
        <Stack spacing={1}>
          <FieldLabel action={labelAction}>
            {formatMessage(intlLabel)}
          </FieldLabel>

          <Combobox
            ref={forwardedRef}
            placeholder={placeholder && formatMessage(placeholder)}
            aria-label={formatMessage(intlLabel)}
            aria-disabled={disabled}
            disabled={disabled}
            value={value}
            // onChange={(countryCode) =>
            //   onChange({
            //     target: {
            //       name: name,
            //       value: countryCode,
            //       type: attribute.type,
            //     },
            //   })
            // }
            onKeyUp={handleKeyPress}
            onClear={() => {
              onChange({
                target: { name: name, value: "", type: attribute.type },
              });
              setTypedTradeSymbol(0);
            }}
          >
            {typedTradeSymbol.length >= 3
              ? parsedOptionsNt.map((value) => (
                  <ComboboxOption value={value} key={value}>
                    {value}
                  </ComboboxOption>
                ))
              : null}
          </Combobox>

          <FieldHint />
          <FieldError />
        </Stack>
      </Field>
    );
  }
);

CustomDropDown.defaultProps = {
  description: null,
  disabled: false,
  error: null,
  labelAction: null,
  required: false,
  value: "",
};

CustomDropDown.propTypes = {
  intlLabel: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  attribute: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.object,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  labelAction: PropTypes.object,
  required: PropTypes.bool,
  value: PropTypes.string,
};

function isExpDateUnique(uniqueExpDates, sSymbol, expDate) {
  // If the sSymbol exists in uniqueExpDates array
  const expDates = uniqueExpDates[sSymbol].map((obj) => obj.ExpDate);
  return expDates.includes(expDate);
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

export default CustomDropDown;
