from src.controllers.usercontroller import UserController
from unittest.mock import patch, MagicMock
import pytest

def util():
    mockeddao = MagicMock()
    controller = UserController(mockeddao)
    return mockeddao, controller

@pytest.mark.unit
def test_email_not_valid():
    mockeddao, controller = util()
    with pytest.raises(ValueError):
        controller.get_user_by_email("123")

@pytest.mark.unit
def test_email_valid_user_not_found():
    mockeddao, controller = util()
    mockeddao.find.return_value = []
    result = controller.get_user_by_email("xyz@student.bth.se")
    assert result is None
    
@pytest.mark.unit
def test_get_one_user_by_email():
    mockeddao, controller = util()
    mockeddao.find.return_value = [{"email":"abc@student.bth.se"}]
    result = controller.get_user_by_email("abc@student.bth.se")
    assert result == {"email":"abc@student.bth.se"}

@pytest.mark.unit
def test_get_multiple_users_by_email(capsys):
    mockeddao, controller = util()
    mockeddao.find.return_value = [
        {"email":"abc@student.bth.se"},
        {"email":"abc@student.bth.se"}
        ]
    result = controller.get_user_by_email("abc@student.bth.se")
    captured = capsys.readouterr()
    assert result == {"email":"abc@student.bth.se"}
    assert captured.out == "Error: more than one user found with mail abc@student.bth.se\n"
   
    
@pytest.mark.unit
def test_database_operation_fails():
    mockeddao, controller = util()
    mockeddao.find.side_effect = Exception("database failure")
    with pytest.raises(Exception):
        controller.get_user_by_email("abc@student.bth.se")