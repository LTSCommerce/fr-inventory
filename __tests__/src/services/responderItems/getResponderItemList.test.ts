import getResponderItemList from '../../../../src/services/responderItem/getResponderItemList'
test('it can load all the item types', async () => {
  const actual = await getResponderItemList(1)
  expect(actual.length).toBeGreaterThan(3)
})
