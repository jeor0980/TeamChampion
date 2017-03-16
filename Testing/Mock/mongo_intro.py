#connect to mongoengine with mongomock
connect('mongoenginetest', host='mongomock://localhost', alias='testdb')
conn = get_connection('testdb')

#given code:
def increase_votes(collection):
	for document in collection.find():
		collection.update(document, {'$set' : {'votes' : document['votes'] + 1}})

#test is written as:
def test_increase_votes():
	collection = mongomock.MongoClient().db.collection
	objects = [dict(votes=1), dict(votes=2), ...]
	for obj in objects:
		obj['_id'] = collection.insert(obj)
	increase_votes(collection)
	for obj in objects:
		stored_obj = collection.find_one({'_id' : obj['_id']})
		stored_obj['votes'] -= 1
		assert stored_obj == obj # by comparing all fields we make sure only votes changed