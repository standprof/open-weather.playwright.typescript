import { test, expect } from '@playwright/test';
import { apiKey } from './common';

test('should get weather in London', async ({ request }) => {
  const weather = await request.get(`?q=London&appid=${apiKey}&units=metric`);

  await test.step('Check response status', async () => {
    expect(weather.ok()).toBeTruthy();
    expect(weather.status()).toBe(200);
  });

  await test.step('Check response has valid JSON', async () => {
    expect(weather.json()).toBeTruthy();
  });

  const weatherData = await weather.json();

  await test.step('Check temperature data', async () => {
    expect(weatherData).toHaveProperty('main.temp');
    expect(typeof weatherData.main.temp).toBe('number');
    expect(weatherData.main.temp).toBeGreaterThan(-100); // Reasonable temperature range
    expect(weatherData.main.temp).toBeLessThan(100);
  });

  await test.step('Check weather description', async () => {
    expect(weatherData).toHaveProperty('weather');
    expect(Array.isArray(weatherData.weather)).toBeTruthy();
    expect(weatherData.weather.length).toBeGreaterThan(0);
    expect(weatherData.weather[0]).toHaveProperty('description');
    expect(typeof weatherData.weather[0].description).toBe('string');
  });

  await test.step('Check humidity data', async () => {
    expect(weatherData).toHaveProperty('main.humidity');
    expect(typeof weatherData.main.humidity).toBe('number');
    expect(weatherData.main.humidity).toBeGreaterThanOrEqual(0);
    expect(weatherData.main.humidity).toBeLessThanOrEqual(100);
  });

  await test.step('Check pressure data', async () => {
    expect(weatherData).toHaveProperty('main.pressure');
    expect(typeof weatherData.main.pressure).toBe('number');
    expect(weatherData.main.pressure).toBeGreaterThan(800); // Reasonable pressure range in hPa
    expect(weatherData.main.pressure).toBeLessThan(1200);
  });

  await test.step('Check city name', async () => {
    expect(weatherData).toHaveProperty('name');
    expect(weatherData.name).toBe('London');
  });

  console.log(await weather.json());
});