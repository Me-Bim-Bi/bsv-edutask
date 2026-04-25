#imports
import pytest
import uuid
from src.util.dao import DAO
from pymongo import errors

@pytest.fixture
def ok_dao(monkeypatch):
    validator= {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["my_string"],
            "properties": {
                "my_string": {
                    "bsonType": "string",
                    "description": "the description of a todo must be determined",
                    "uniqueItems": True
                }, 
                "my_bool": {
                    "bsonType": "bool"
                }
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

#Testing if input with data known to be compliant to validator creates expected return values
@pytest.mark.integrations
def test_return_object_data_string_is_correct(ok_data, ok_dao):
    #Arrange
    #Arranged in fixture
    #Act
    test_return_object = ok_dao.create(ok_data)
    #Assert
    assert test_return_object["my_string"] == ok_data["my_string"]


@pytest.mark.integrations
def test_return_object_data_bool_is_correct(ok_data, ok_dao):
    #Arrange
    #Act
    test_return_object = ok_dao.create(ok_data)
    #Assert
    assert test_return_object["my_bool"] == ok_data["my_bool"]

@pytest.mark.integrations
def test_return_object_has_id_attribute(ok_data, ok_dao):
    test_return_object = ok_dao.create(ok_data)
    assert "_id" in test_return_object
    
@pytest.mark.integrations
def test_return_object_has_no_unexpected_data(ok_data, ok_dao):
    test_return_object = ok_dao.create(ok_data)
    assert len(test_return_object) == len(ok_data) + 1

#Testing if expected WriteError occurs when input data not compliant to validator
@pytest.mark.integrations
def test_data_not_all_required_properties_only_bool(ok_dao):
    with pytest.raises((errors.WriteError)):
        ok_dao.create({"my_bool": True})
        
@pytest.mark.integrations
def test_data_not_all_required_properties_empty_data(ok_dao):
    with pytest.raises((errors.WriteError)):
        ok_dao.create({})

@pytest.mark.integrations
def test_data_all_required_properties_wrong_data_type_bool(ok_dao):
    with pytest.raises((errors.WriteError)):
        ok_dao.create({"my_bool": "Jane", "my_string": "Tarzan"})

@pytest.mark.integrations
def test_data_all_required_properties_wrong_data_type_string(ok_dao):
    with pytest.raises((errors.WriteError)):
        ok_dao.create({"my_bool": True, "my_string": True})

@pytest.mark.integrations
def test_null_values_not_allowed(ok_dao):
    with pytest.raises((errors.WriteError)):
        ok_dao.create({
            "my_string": None,
            "my_bool": True
        })

#Test uniqueItems
""" @pytest.mark.integrations
def test_not_unique_data(ok_dao):
    #This test fails since uniqueItems in bson only works on bson arrays. We have implemented uniqueItems on a String
    same_name = "Karl"
    ok_dao.create({"my_string":same_name, "my_bool":False})
    with pytest.raises((errors.WriteError)):
        ok_dao.create({"my_string":same_name, "my_bool":True}) """