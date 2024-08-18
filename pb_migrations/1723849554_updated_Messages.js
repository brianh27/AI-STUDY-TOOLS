/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ba4i0tco6r8xx15")

  collection.name = "Test"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ba4i0tco6r8xx15")

  collection.name = "Messages"

  return dao.saveCollection(collection)
})
