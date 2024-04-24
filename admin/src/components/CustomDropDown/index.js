import React, { useState, useEffect } from "react";
import { fetchData, checkIsFetchingData } from "./fetchData";
import { getFromLocalStorage } from "./cache";
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
    var prevStateInstrumentType = "";
    var prevTypedTradeSymbol = "";

    const fetchApi = useFetchClient();
    const { modifiedData } = useCMEditViewDataManager();

    useEffect(() => {
      console.log("use effect 1 .. ");
      async function fetchDataWrapper() {
        if (checkIsFetchingData()) {
          return;
        }
        try {
          const data = await fetchData(fetchApi);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      fetchDataWrapper();
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
      const nTradeSymbolsdataArray = getFromLocalStorage(instrument_type, true);
      console.log(
        "before filter nTradeSymbolsdataArray len: ",
        nTradeSymbolsdataArray.length
      );

      if (nTradeSymbolsdataArray.length == 0) {
        // no data in cache it might be expired, load again
        console.log("use effect 2 calling fetchData()");
        fetchData(fetchApi);
      }
      // for given instrument_type and filter based ntradeSymbol starts with typedTradeSymbol
      const dataArrayF = nTradeSymbolsdataArray.filter((obj) =>
        obj.toLowerCase().startsWith(typedTradeSymbol)
      );
      console.log("after filter data Array len: ", dataArrayF.length);

      if (dataArrayF.length > 0) {
        setNTradeSymbols(dataArrayF);
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

    const handleOnChange = (value) => {
      onChange({
        target: {
          name: name,
          value: value,
          type: attribute.type,
        },
      });
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
            onChange={(scrip) => handleOnChange(scrip)}
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

export default CustomDropDown;
