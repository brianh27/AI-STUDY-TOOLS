/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "ba4i0tco6r8xx15",
    "created": "2024-08-16 00:25:03.043Z",
    "updated": "2024-08-16 00:25:03.043Z",
    "name": "Messages",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "myi0sd7r",
        "name": "Message",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("ba4i0tco6r8xx15");

  return dao.deleteCollection(collection);
})
