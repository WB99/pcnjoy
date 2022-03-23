import React, { useEffect } from "react";

function SavedPlace(props) {
  const [checked, setChecked] = React.useState([]);

  useEffect(() => {
    
  }, [props.savedPlaces])

  const handleChange = (e) => {
    console.log(e.target.id)
    setChecked((current) => {
      let newArray = current
      newArray[e.target.id] = !current[e.target.id]
      return newArray
    });
  };

  const Checkbox = ({ label, value, onChange }) => {
    return (
      <label>
        <input type="checkbox" checked={value} onChange={onChange} />
        {label}
      </label>
    );
  };

  console.log("checked: ", checked);
  console.log("savedPlaces: ", props.savedPlaces);
  return (
    <div>
      <div>SavedPlace</div>
      <div>
        <Checkbox label="My Value" value={checked} onChange={handleChange} id={0}/>
        <p>Is "My Value" checked? {checked.toString()}</p>
      </div>
    </div>
  );
}

export default SavedPlace;
