// Simple test file to debug SWR import
import swr from 'swr';

console.log('SWR import test:', typeof swr);
console.log('SWR keys:', Object.keys(swr || {}));

export default function TestSWR() {
  console.log('SWR in component:', typeof swr);
  return null;
}