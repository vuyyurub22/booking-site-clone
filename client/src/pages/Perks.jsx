export default function Perks({ selected, onChange }) {
  function boxChecked(ev) {
    const { checked, name } = ev.target;
    if (checked) {
      onChange([...selected, name]);
    } else {
      onChange([...selected.filter((selectedName) => selectedName !== name)]);
    }
  }
  return (
    <>
      <label className="border p-4 flex rounded-xl gap-2 items-center cursor-pointer">
        <input
          type="checkbox"
          checked={selected.includes("wifi")}
          name="wifi"
          onChange={boxChecked}
        />
        <span>Wifi</span>
      </label>
      <label className="border p-4 flex rounded-xl gap-2 items-center cursor-pointer">
        <input
          type="checkbox"
          checked={selected.includes("parking")}
          name="parking"
          onChange={boxChecked}
        />
        <span>Free Parking</span>
      </label>
      <label className="border p-4 flex rounded-xl gap-2 items-center cursor-pointer">
        <input
          type="checkbox"
          checked={selected.includes("tv")}
          name="tv"
          onChange={boxChecked}
        />
        <span>TV</span>
      </label>
      <label className="border p-4 flex rounded-xl gap-2 items-center cursor-pointer">
        <input
          type="checkbox"
          checked={selected.includes("pets")}
          name="pets"
          onChange={boxChecked}
        />
        <span>Pets</span>
      </label>
    </>
  );
}
