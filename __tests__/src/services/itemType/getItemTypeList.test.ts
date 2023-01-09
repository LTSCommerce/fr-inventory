import getItemTypeList from '../../../../src/services/itemType/getItemTypeList'
test('it can load all the item types', async () => {
  const actual = await getItemTypeList()
  expect(actual.length).toBeGreaterThan(3)
  expect(actual[0].name.length).toBeGreaterThan(1)
})
