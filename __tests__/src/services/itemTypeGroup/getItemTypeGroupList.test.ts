import getItemTypeGroupList from '../../../../src/services/itemTypeGroup/getItemTypeGroupList'
test('it can load all the item types', async () => {
  const actual = await getItemTypeGroupList()
  expect(actual.length).toBeGreaterThan(3)
  expect(actual[0].name.length).toBeGreaterThan(1)
})
