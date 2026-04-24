#imports
import pytest
import uuid
import pymongo
from src.util.dao import DAO
from pymongo import errors

@pytest.fixture
def ok_dao(monkeypatch):
    validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["my_string", "my_bool"],
            "additionalProperties": False,
            "properties": {
                "_id": {},
                "my_string": {"bsonType": "string"},
                "my_bool": {"bsonType": "bool"}
            }
        }
    }

    # set env FIRST
    monkeypatch.setenv(
        "MONGO_URL",
        "mongodb://root:root@localhost:27017/?authSource=admin"
    )

    # mock validator
    monkeypatch.setattr("src.util.dao.getValidator", lambda _: validator)

    # create DAO AFTER env is ready
    collection_name = f"test_{uuid.uuid4().hex}"
    dao = DAO(collection_name)

    yield dao

    # Remove the entire collection after test finishes 
    dao.drop()

@pytest.fixture
def ok_data():
    return {"my_string": "Jane", "my_bool": True}

@pytest.fixture
def data_no_bool():
    return {"my_string": "Jane"}

#Start with testing if input with data known to be compliant to validator creates expected return values
@pytest.mark.integration
def test_return_object_data_string_is_correct(ok_data, ok_dao):
    #Arrange
    #Arranged in fixture
    #Act
    test_return_object = ok_dao.create(ok_data)
    #Assert
    assert test_return_object["my_string"] == ok_data["my_string"]

@pytest.mark.integration
def test_return_object_data_bool_is_correct(ok_data, ok_dao):
    #Arrange

    #Act
    test_return_object = ok_dao.create(ok_data)

    #Assert
    assert test_return_object["my_bool"] is ok_data["my_bool"]

@pytest.mark.integration
def test_return_object_has_id_attribute(ok_data, ok_dao):
    test_return_object = ok_dao.create(ok_data)
    assert "_id" in test_return_object

@pytest.mark.integration
def test_return_object_has_no_unexpected_data(ok_data, ok_dao):
    test_return_object = ok_dao.create(ok_data)
    assert len(test_return_object) == len(ok_data) + 1

#Testing if expected WriteError occurs when input data not compliant to validator
@pytest.mark.integration
def test_data_not_all_required_properties_only_string(ok_dao, data_no_bool):
    with pytest.raises((errors.WriteError, errors.OperationFailure)):
        ok_dao.create(data_no_bool)

@pytest.mark.integration
def test_data_not_all_required_properties_only_bool(ok_dao):
    with pytest.raises((errors.WriteError, errors.OperationFailure)):
        ok_dao.create({"my_bool": True})
        
@pytest.mark.integration
def test_data_not_all_required_properties_empty_data(ok_dao):
    with pytest.raises((errors.WriteError, errors.OperationFailure)):
        ok_dao.create({})

@pytest.mark.integration
def test_data_all_required_properties_wrong_data_type_bool(ok_dao):
    with pytest.raises((errors.WriteError, errors.OperationFailure)):
        ok_dao.create({"my_bool": "Jane", "my_string": "Tarzan"})

@pytest.mark.integration
def test_data_all_required_properties_wrong_data_type_string(ok_dao):
    with pytest.raises((errors.WriteError, errors.OperationFailure)):
        ok_dao.create({"my_bool": True, "my_string": True})
        
@pytest.mark.integration
def test_unique_data(ok_dao):
    ok_dao.collection.create_index("my_string", unique=True)
    name = "Same"
    ok_dao.create({"my_string": name, "my_bool": True})
    with pytest.raises(errors.DuplicateKeyError):
        ok_dao.create({"my_string": name, "my_bool": False})
     
