import { test, expect } from '@playwright/test';
import { apiKey } from './common';

test('should get weather in London', async ({ request }) => {
  const weather = await request.get(`?q=London&appid=${apiKey}&units=metric`);
  expect(weather.ok()).toBeTruthy();
  expect(weather.json()).toBeTruthy();

  const weatherData = await weather.json();
  expect(weatherData).toHaveProperty('main.temp');
  expect(typeof weatherData.main.temp).toBe('number');
  expect(weatherData.main.temp).toBeGreaterThan(-100); // Reasonable temperature range
  expect(weatherData.main.temp).toBeLessThan(100);

  console.log(await weather.json());
});