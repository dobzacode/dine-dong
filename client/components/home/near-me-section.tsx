import { Suspense } from 'react';
import MealSnippet from '../meal/meal-snippet';

export default async function NearMeSection() {
  return (
    <section className="grid grid-cols-5 gap-x-md gap-y-2xl">
      {new Array(10).fill(0).map((_, i) => (
        <Suspense key={`near-me-meal-${i}-skeleton`} fallback={<p>Chargement...</p>}>
          <MealSnippet
            key={`near-me-meal-${i}`}
            fetchOpt={[
              {
                offset: 0 + i,
                limit: 1,
                lat: 45.767572,
                lng: 4.833102,
                radius: 10,
                diet: [],
                name: 'fdsfdsfd',
                weight_max: 1000,
                weight_min: 0
              },
              {
                tags: ['near-me-meals']
              }
            ]}
          />
        </Suspense>
      ))}
    </section>
  );
}
