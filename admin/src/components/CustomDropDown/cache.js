import {
  indexToSegmentMapping,
  ttlLocalStorage,
  maxLocalStorageSize,
} from "./constants";

// Flag to track if getWithExpiry is currently removing cached itmes from localstorage
var isRemovingItmes = false;

// Function to set data in local storage with TTL
function setLocalStorageWithExpiry(key, value, ttl) {
  const now = new Date();

  console.log("setting local storage key: ", key, "ttl: ", ttl);

  localStorage.setItem(
    key,
    JSON.stringify({
      value: value,
      expiry: now.getTime() + ttl,
    })
  );
}

// Function to get data from local storage, if expired then remove all data and fetch
function getWithExpiry(key, fetchIfExpired) {
  const itemStr = localStorage.getItem(key);

  // If the item doesn't exist, return null
  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);
  const now = new Date();

  // Check if the item has expired
  if (now.getTime() > item.expiry) {
    // If the item is expired, remove all from localStorage and return null
    // Check if it is already removing items
    if (isRemovingItmes) {
      console.log(
        "getWithExpiry is already removing cached items, skipping this call."
      );
      return null;
    }
    removeCachedItemsFromLocalStorage(fetchIfExpired);
    return null;
  }

  return item.value;
}

function removeCachedItemsFromLocalStorage(fetchIfExpired) {
  console.log("removing and fetching cached items from local storage");
  isRemovingItmes = true;

  // Get the values of the object
  const values = Object.values(indexToSegmentMapping);

  values.forEach((value) => {
    localStorage.removeItem(value);
  });

  isRemovingItmes = false;
}

function addToLocalStorage(key, data, ttl = ttlLocalStorage) {
  // 1hr ttl
  console.log("adding to cache key: ", key, "ttl: ", ttl);
  console.log("is local storage full: ", isLocalStorageFull());
  setLocalStorageWithExpiry(key, data, ttl);
}

function isLocalStorageFull() {
  const size = JSON.stringify(localStorage).length;
  console.log("local storage size: ", size, "max size: ", maxLocalStorageSize);
  return size >= maxLocalStorageSize;
}

// Function to get data from local storage for given key,
// if expired then it will be removing all key
function getFromLocalStorage(key, fetchIfExpired) {
  console.log("retrieving from cache key: ", key);
  return getWithExpiry(key, fetchIfExpired) || [];
}

export { addToLocalStorage, getFromLocalStorage };
