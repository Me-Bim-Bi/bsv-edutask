#imports
import pytest
from src.util.dao import DAO
from pymongo import errors
from src.util.validators import getValidator

#Fixtures
@pytest.fixture
def ok_data():
    test_data = {"my_string": "Jane", "my_bool": True}
    return test_data


@pytest.fixture
def ok_data_only_string():
    return {"my_string": "Jane"}


@pytest.fixture
def ok_dao():
    #Using validator with bson String and Boolean based on production validator 'todo'
    test_dao = DAO("todo_test")
    
    yield test_dao
    
    # Remove the entire collection after test finishes
    test_dao.drop()


#Testing if input with data known to be compliant to validator creates expected return values
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
    assert test_return_object["my_bool"] == ok_data["my_bool"]


@pytest.mark.integration
def test_return_object_has_id_attribute(ok_data, ok_dao):
    test_return_object = ok_dao.create(ok_data)
    assert "_id" in test_return_object


@pytest.mark.integration
def test_return_object_has_no_unexpected_data(ok_data, ok_dao):
    #db automatically adds '_id' attribute when creating document.
    #length of return object should equal (length of input data + 1)
    test_return_object = ok_dao.create(ok_data)
    assert len(test_return_object) == len(ok_data) + 1


@pytest.mark.integration
def test_data_ok_with_only_string(ok_data_only_string, ok_dao):
    test_return_object = ok_dao.create(ok_data_only_string)
    #Assert
    assert test_return_object["my_string"] == ok_data_only_string["my_string"]
    assert "my_bool" not in test_return_object or test_return_object.get("my_bool") is None


#Testing if expected WriteError occurs when input data not compliant to validator
@pytest.mark.integration
def test_data_not_all_required_properties_only_bool(ok_dao):
    with pytest.raises(errors.WriteError):
        ok_dao.create({"my_bool":True})


@pytest.mark.integration
def test_data_not_all_required_properties_empty_data(ok_dao):
    with pytest.raises(errors.WriteError):
        ok_dao.create({})


@pytest.mark.integration
def test_data_all_required_properties_wrong_data_type_bool(ok_dao):
    with pytest.raises(errors.WriteError):
        ok_dao.create({"my_bool": "Jane", "my_string": "Tarzan"})


@pytest.mark.integration
def test_data_all_required_properties_wrong_data_type_string(ok_dao):
    with pytest.raises(errors.WriteError):
        ok_dao.create({"my_bool": True, "my_string": True})


@pytest.mark.integration
def test_null_values_not_allowed(ok_dao):
    with pytest.raises((errors.WriteError)):
        ok_dao.create({
            "my_string": None,
            "my_bool": True
        })


# Since additionalProperties is not defined in the schema, MongoDB allows extra fields, 
# so we should test that documents with additional fields are still accepted.”
@pytest.mark.integration
def test_extra_field_allowed_by_schema(ok_dao):
    result = ok_dao.create({
        "my_string": "Jane",
        "my_bool": True,
        "unexpected": 123
    })
    assert "unexpected" in result


#Test uniqueItems
""" @pytest.mark.integrations
def test_not_unique_data(ok_dao):
    #This test fails since uniqueItems in bson only works on bson arrays. We have implemented uniqueItems on a String.
    same_name = "Karl"
    ok_dao.create({"my_string":same_name, "my_bool":False})
    with pytest.raises((errors.WriteError)):
        ok_dao.create({"my_string":same_name, "my_bool":True}) """

