#imports
import pytest
import json
from src.util.dao import DAO
from src.util.validators import getValidator

@pytest.fixture
def ok_data():
    #test_dao = DAO("my_validator")
    test_data = {"my_string": "Jane", "my_bool": True}
    return test_data

@pytest.fixture
def data_no_bool():
    #test_dao = DAO("my_validator")
    test_data_2 = {"my_string": "Jane"}
    return test_data_2

@pytest.fixture
def ok_dao():
    test_dao = DAO("my_validator")
    #test_data = {"my_string": "Jane", "my_bool": True}
    return test_dao

@pytest.mark.integration
def test_return_object_data_string_is_correct(ok_data, ok_dao):
    #Arrange

    #Act
    test_return_object = ok_dao.create(ok_data)

    #Assert
    assert test_return_object["my_string"] == "Jane"

@pytest.mark.integration
def test_return_object_data_bool_is_correct(ok_data, ok_dao):
    #Arrange

    #Act
    test_return_object = ok_dao.create(ok_data)

    #Assert
    assert test_return_object["my_bool"] is ok_data["my_bool"]

@pytest.mark.integration
def test_return_object_has_id_attribute(ok_data, ok_dao):
    #todo
    test_return_object = ok_dao.create(ok_data)
    assert "_id" in test_return_object


@pytest.mark.integration
def test_data_not_all_properties(ok_dao, data_no_bool):
    #Det här funkar inte, WriteError är i MondoDB. Måste lösas.
    #with pytest.raises(WriteError):
    #    test_return_object = ok_dao.create(data_no_bool)
