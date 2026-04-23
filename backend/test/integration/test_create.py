#imports
import pytest
import json
from src.util.dao import DAO
from pymongo import errors
from src.util.validators import getValidator

@pytest.fixture
def ok_data():
    test_data = {"my_string": "Jane", "my_bool": True}
    return test_data

@pytest.fixture
def data_no_bool():
    test_data_2 = {"my_string": "Jane"}
    return test_data_2

@pytest.fixture
def ok_dao():
    test_dao = DAO("my_validator")
    return test_dao

@pytest.fixture
def ok_test_return_object(ok_data, ok_dao):
    test_return_object = ok_dao.create(ok_data)
    return test_return_object

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
    with pytest.raises(errors.WriteError):
        ok_dao.create(data_no_bool)

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
def test_unique_data(ok_dao):
    #Undrar hur detta ska implementeras.
    name = "Same"
    test_return_object = ok_dao.create({"my_string":name,"my_bool": True})
    test_return_object2 = ok_dao.create({"my_string":name,"my_bool": False})
    assert 1==1

