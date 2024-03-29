import getResponderList from '../../../../src/services/responder/getResponderList'

test('it can load all the responders', async () => {
  const actual = await getResponderList()
  expect(actual.length).toBeGreaterThan(3)
  expect(actual[0].name.length).toBeGreaterThan(1)
})
