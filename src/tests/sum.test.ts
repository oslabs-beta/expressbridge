import mySum from './sum';

test('adds 1 + 2 to equal 3', () => {
  expect(mySum(1, 2)).toBe(3);
});

// test('fails when attempting to add string as parameter with 1 + "2" ', () => { 
//   expect(() => {mySum(1, "2")}).toThrow(TypeError);
// });