import DietFilter from './diet-filter';
import Reset from './reset';
import SliderFilter from './slider-filter';
import SortSection from './sort-section';

export default function FilterSortMenu() {
  return (
    <section className="flex w-full justify-between gap-sm">
      <section className="flex gap-sm">
        <SliderFilter
          type="radius"
          min={1}
          max={10}
          step={1}
          defaultValue={1}
          triggerLabel="Distance"
          label="Distance par rapport à ma position"
          unit="km"
        />
        <SliderFilter
          type="max_price"
          min={2}
          max={100}
          step={1}
          defaultValue={2}
          triggerLabel="Prix"
          label="Prix maximum"
          unit="euros"
        />
        <DietFilter />
        <SortSection />
      </section>
      <Reset />
    </section>
  );
}
