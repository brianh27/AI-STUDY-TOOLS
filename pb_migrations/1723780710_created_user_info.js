/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "19ksm3cweud88dm",
    "created": "2024-08-16 03:58:30.366Z",
    "updated": "2024-08-16 03:58:30.366Z",
    "name": "user_info",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "7sj6gak8",
        "name": "email",
        "type": "email",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "exceptDomains": null,
          "onlyDomains": null
        }
      },
      {
        "system": false,
        "id": "vaxn1v5v",
        "name": "password",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
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
  const collection = dao.findCollectionByNameOrId("19ksm3cweud88dm");

  return dao.deleteCollection(collection);
})
