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
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "@reach/combobox/styles.css";

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
      radius: 0 * 1000,
    },
  });

  return (
    <div>
      <p>SearchBar</p>
      <Combobox
        onSelect={async (address) => {
          setValue(address, false);
          clearSuggestions();
          try {
            const results = await getGeocode({ address });
            const coord = await getLatLng(results[0]);
            props.setCoord(coord);
            props.setMarkers((current) => [
              ...current,
              {
                key: `${coord.lat},${coord.lng}`,
                lat: coord.lat,
                lng: coord.lng,
              },
            ]);
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
          placeholder="Enter an Address"
        />
        <ComboboxPopover>
          {status === "OK" &&
            data.map(({ id, description }) => (
              <ComboboxOption key={id} value={description} />
            ))}
        </ComboboxPopover>
      </Combobox>

      <Button>Search</Button>
    </div>
  );
}

export default SearchBar;
