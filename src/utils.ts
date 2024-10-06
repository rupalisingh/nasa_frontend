import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPolygonCentroid(polygonCoords: number[][]): number[] {
  let [xSum, ySum] = [0, 0];
  const numPoints = polygonCoords.length;

  polygonCoords.forEach(([lat, lon]) => {
    xSum += lat;
    ySum += lon;
  });

  return [xSum / numPoints, ySum / numPoints];
}
