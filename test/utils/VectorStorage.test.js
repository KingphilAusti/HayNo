import VectorStorage from '../../src/VectorStorage/VectorStorage';

describe('VectorStorage', () => {
  let vectorStorage;

  beforeEach(() => {
    vectorStorage = new VectorStorage([
      { vector: [1, 2, 3], content: 'Data 1' },
      { vector: [4, 5, 6], content: 'Data 2' },
      { vector: [7, 8, 9], content: 'Data 3' },
    ]);
  });

  test('getEntryAtIndex should return the correct entry', () => {
    const entry = vectorStorage.getEntryAtIndex(1);
    expect(entry).toEqual({ vector: [4, 5, 6], content: 'Data 2' });
  });

  test('getData should return the correct data', () => {
    const data = vectorStorage.getData(2);
    expect(data).toBe('Data 3');
  });

  test('size should return the correct size', () => {
    const size = vectorStorage.size();
    expect(size).toBe(3);
  });

  test('getNearestNeighbors should return the nearest neighbors', () => {
    const vector = [0, 0, 0];
    const k = 2;
    const neighbors = vectorStorage.getNearestNeighbors(vector, k);
    expect(neighbors).toEqual([
      { distance: Math.sqrt(14), entry: { vector: [1, 2, 3], content: 'Data 1' } },
      { distance: Math.sqrt(77), entry: { vector: [4, 5, 6], content: 'Data 2' } },
    ]);
  });

  test('addVector should add a vector to the storage', () => {
    const vector = [10, 11, 12];
    const content = 'Data 4';
    const newIndex = vectorStorage.addVector(vector, content);
    expect(newIndex).toBe(4);
    expect(vectorStorage.getEntryAtIndex(3)).toEqual({ vector: [10, 11, 12], content: 'Data 4' });
  });
});