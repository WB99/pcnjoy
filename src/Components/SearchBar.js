import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxPopover,
} from "@reach/combobox";
import React from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import "@reach/combobox/styles.css";
import Geocode from "react-geocode";

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API);
Geocode.enableDebug();

function SearchBar(props) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 1.3521, lng: () => 103.8198 },
      radius: 40 * 1000,
      componentRestrictions: { country: "sg" },
    },
  });

  return (
    <div>
      <Combobox
        onSelect={async (address) => {
          setValue(address, false);
          clearSuggestions();
          try {
            const results = await getGeocode({ address });
            const coord = await getLatLng(results[0]);
            props.setCoord(coord);
            props.setMarkers((current) => {
              if (current.length > 0) {
                let newArray = [...current];
                newArray[props.id] = {
                  key: `${coord.lat},${coord.lng}`,
                  lat: coord.lat,
                  lng: coord.lng,
                };
                return newArray;
              } else {
                return [
                  ...current,
                  {
                    key: `${coord.lat},${coord.lng}`,
                    lat: coord.lat,
                    lng: coord.lng,
                  },
                ];
              }
            });
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <ComboboxInput
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          disabled={!ready}
          placeholder={props.address ? props.address : "Enter an Address"}
        />
        <ComboboxPopover>
          {status === "OK" &&
            data.map(({ id, description }) => (
              <ComboboxOption key={id} value={description} />
            ))}
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}

export default SearchBar;
