import { Ruler, Scale, Thermometer, Database, Clock, Zap, Square, Beaker, Hourglass } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Unit = {
  name: string;
  symbol: string;
};

export type ConversionCategory = {
  name: string;
  icon: LucideIcon;
  units: Unit[];
  convert: (value: number, from: string, to: string) => number | Promise<number>;
};

// --- Conversion Logic ---

const lengthFactors: { [key: string]: number } = { // to meter
  'm': 1, 'km': 1000, 'cm': 0.01, 'mm': 0.001, 'mi': 1609.34, 'yd': 0.9144, 'ft': 0.3048, 'in': 0.0254
};
const weightFactors: { [key: string]: number } = { // to kg
  'kg': 1, 'g': 0.001, 'mg': 1e-6, 't': 1000, 'lb': 0.453592, 'oz': 0.0283495
};
const dataFactors: { [key: string]: number } = { // to bytes
    'B': 1, 'KB': 1024, 'MB': 1024**2, 'GB': 1024**3, 'TB': 1024**4
};
const timeFactors: { [key: string]: number } = { // to seconds
    's': 1, 'min': 60, 'h': 3600, 'd': 86400, 'wk': 604800
};
const speedFactors: { [key: string]: number } = { // to m/s
    'm/s': 1, 'km/h': 1 / 3.6, 'mph': 0.44704
};
const areaFactors: { [key: string]: number } = { // to sq meter
    'm²': 1, 'km²': 1e6, 'ha': 10000, 'acre': 4046.86, 'ft²': 0.092903, 'in²': 0.00064516
};
const volumeFactors: { [key: string]: number } = { // to liter
    'L': 1, 'mL': 0.001, 'gal': 3.78541, 'qt': 0.946353, 'pt': 0.473176, 'fl-oz': 0.0295735
};

function linearConverter(factors: { [key: string]: number }) {
  return (value: number, from: string, to: string) => {
    const fromFactor = factors[from];
    const toFactor = factors[to];
    if (fromFactor === undefined || toFactor === undefined) return NaN;
    const valueInBase = value * fromFactor;
    return valueInBase / toFactor;
  };
}

const tempConversions: { [from: string]: { [to: string]: (value: number) => number } } = {
  '°C': {
    '°F': (c) => (c * 9/5) + 32,
    'K': (c) => c + 273.15,
  },
  '°F': {
    '°C': (f) => (f - 32) * 5/9,
    'K': (f) => ((f - 32) * 5/9) + 273.15,
  },
  'K': {
    '°C': (k) => k - 273.15,
    '°F': (k) => ((k - 273.15) * 9/5) + 32,
  }
};

function tempConverter(value: number, from: string, to: string) {
  if (from === to) return value;
  const conversionFunc = tempConversions[from]?.[to];
  return conversionFunc ? conversionFunc(value) : NaN;
}


// --- Category Definitions ---

export const conversionCategories: ConversionCategory[] = [
  {
    name: 'Length',
    icon: Ruler,
    units: [
      { name: 'Meters', symbol: 'm' }, { name: 'Kilometers', symbol: 'km' },
      { name: 'Centimeters', symbol: 'cm' }, { name: 'Millimeters', symbol: 'mm' },
      { name: 'Miles', symbol: 'mi' }, { name: 'Yards', symbol: 'yd' },
      { name: 'Feet', symbol: 'ft' }, { name: 'Inches', symbol: 'in' },
    ],
    convert: linearConverter(lengthFactors),
  },
  {
    name: 'Weight',
    icon: Scale,
    units: [
      { name: 'Kilograms', symbol: 'kg' }, { name: 'Grams', symbol: 'g' },
      { name: 'Milligrams', symbol: 'mg' }, { name: 'Metric Tonnes', symbol: 't' },
      { name: 'Pounds', symbol: 'lb' }, { name: 'Ounces', symbol: 'oz' },
    ],
    convert: linearConverter(weightFactors),
  },
  {
    name: 'Temperature',
    icon: Thermometer,
    units: [
      { name: 'Celsius', symbol: '°C' }, { name: 'Fahrenheit', symbol: '°F' },
      { name: 'Kelvin', symbol: 'K' },
    ],
    convert: tempConverter,
  },
  {
      name: 'Data Storage',
      icon: Database,
      units: [
          { name: 'Bytes', symbol: 'B' }, { name: 'Kilobytes', symbol: 'KB' },
          { name: 'Megabytes', symbol: 'MB' }, { name: 'Gigabytes', symbol: 'GB' },
          { name: 'Terabytes', symbol: 'TB' }
      ],
      convert: linearConverter(dataFactors),
  },
  {
      name: 'Time',
      icon: Clock,
      units: [
          { name: 'Seconds', symbol: 's' }, { name: 'Minutes', symbol: 'min' },
          { name: 'Hours', symbol: 'h' }, { name: 'Days', symbol: 'd' },
          { name: 'Weeks', symbol: 'wk' }
      ],
      convert: linearConverter(timeFactors),
  },
  {
      name: 'Speed',
      icon: Zap,
      units: [
          { name: 'Meters/second', symbol: 'm/s' },
          { name: 'Kilometers/hour', symbol: 'km/h' },
          { name: 'Miles/hour', symbol: 'mph' }
      ],
      convert: linearConverter(speedFactors),
  },
  {
      name: 'Area',
      icon: Square,
      units: [
          { name: 'Square Meters', symbol: 'm²' }, { name: 'Square Kilometers', symbol: 'km²' },
          { name: 'Hectares', symbol: 'ha' }, { name: 'Acres', symbol: 'acre' },
          { name: 'Square Feet', symbol: 'ft²' }, { name: 'Square Inches', symbol: 'in²' }
      ],
      convert: linearConverter(areaFactors),
  },
  {
      name: 'Volume',
      icon: Beaker,
      units: [
          { name: 'Liters', symbol: 'L' }, { name: 'Milliliters', symbol: 'mL' },
          { name: 'US Gallons', symbol: 'gal' }, { name: 'US Quarts', symbol: 'qt' },
          { name: 'US Pints', symbol: 'pt' }, { name: 'US Fluid Ounces', symbol: 'fl-oz' }
      ],
      convert: linearConverter(volumeFactors),
  }
];
