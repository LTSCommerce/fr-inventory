import getResponderList from '../getResponderList'

test('it can load all the responders', async () => {
  const actual = await getResponderList()
  expect(actual).toHaveLength(3)
  expect(actual[0].name.length).toBeGreaterThan(1)
})
