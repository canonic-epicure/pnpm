import test = require('tape')
import getList from '../src'
import path = require('path')

const fixture = path.join(__dirname, 'fixture')

test('one package depth 0', async t => {
  const list = await getList(fixture, {depth: 0})

  t.deepEqual(list, [
      {
        pkg: {
          name: 'minimatch',
          version: '3.0.4',
        }
      },
      {
        pkg: {
          name: 'rimraf',
          version: '2.5.1',
        },
      },
      {
        pkg: {
          name: 'is-positive',
          version: '1.0.0',
        }
      },
      {
        pkg: {
          name: 'is-negative',
          version: '1.0.0',
        }
      },
  ])

  t.end()
})

test('one package depth 1', async t => {
  const list = await getList(fixture, {depth: 1})

  t.deepEqual(list, [
      {
        pkg: {
          name: 'minimatch',
          version: '3.0.4',
        },
        dependencies: [
          {
            pkg: {
              name: 'brace-expansion',
              version: '1.1.8',
            }
          }
        ],
      },
      {
        pkg: {
          name: 'rimraf',
          version: '2.5.1',
        },
        dependencies: [
          {
            pkg: {
              name: 'glob',
              version: '6.0.4',
            }
          }
        ]
      },
      {
        pkg: {
          name: 'is-positive',
          version: '1.0.0',
        }
      },
      {
        pkg: {
          name: 'is-negative',
          version: '1.0.0',
        }
      },
  ])

  t.end()
})

test('only prod depth 0', async t => {
  const list = await getList(fixture, {depth: 0, only: 'prod'})

  t.deepEqual(list, [
      {
        pkg: {
          name: 'minimatch',
          version: '3.0.4',
        },
      },
      {
        pkg: {
          name: 'rimraf',
          version: '2.5.1',
        },
      },
  ])

  t.end()
})

test('only dev depth 0', async t => {
  const list = await getList(fixture, {depth: 0, only: 'dev'})

  t.deepEqual(list, [
      {
        pkg: {
          name: 'is-positive',
          version: '1.0.0',
        }
      },
  ])

  t.end()
})

test('filter 1 package with depth 0', async t => {
  const list = await getList(fixture, {depth: 0, searched: [{name: 'rimraf', versionRange: '*'}]})

  t.deepEqual(list, [
      {
        pkg: {
          name: 'rimraf',
          version: '2.5.1',
        }
      },
  ])

  t.end()
})

test('filter 2 packages with depth 100', async t => {
  const searched = [
    {name: 'minimatch', versionRange: '*'},
    {name: 'once', versionRange: '*'},
  ]
  const list = await getList(fixture, {depth: 100, searched})

  t.deepEqual(list, [
    {
      pkg: {
        name: 'minimatch',
        version: '3.0.4',
      },
    },
    {
      pkg: {
        name: 'rimraf',
        version: '2.5.1',
      },
      dependencies: [
        {
          pkg: {
            name: 'glob',
            version: '6.0.4',
          },
          dependencies: [
            {
              pkg: {
                name: 'inflight',
                version: '1.0.6',
              },
              dependencies: [
                {
                  pkg: {
                    name: 'once',
                    version: '1.4.0',
                  }
                }
              ]
            },
            {
              pkg: {
                name: 'minimatch',
                version: '3.0.4',
              }
            },
            {
              pkg: {
                name: 'once',
                version: '1.4.0',
              }
            }
          ]
        }
      ]
    }
  ])

  t.end()
})
