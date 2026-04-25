# from src.controllers.usercontroller import UserController
# from src.util.helpers import ValidationHelper
# # from src.util.dao import DAO
import pytest
import unittest.mock as mock
from src.util.helpers import ValidationHelper

# def test_validateAge():
    #dao_obj = DAO("kitty_katt")
    #usercontroller = UserController()
    #validationhelper = ValidationHelper(usercontroller)
    #validationhelper.validateAge()


# @pytest.fixture
# def sut(age: int):
#     mockedusercontroller = mock.MagicMock() # create a fake object
#     mockedusercontroller.get.return_value = {'age': age} # when use object.get => return value {'age': age}
#     mockedsut = ValidationHelper(usercontroller=mockedusercontroller)
#     return mockedsut

# @pytest.mark.demo
# @pytest.mark.parametrize('age, expected', [(-1, 'invalid'), (0, 'underaged'), (1, 'underaged'), (17, 'underaged'), (18, 'valid'), (19, 'valid'), (119, 'valid'), (120, 'valid'), (121, 'invalid')])
# def test_validateAge(sut, expected):
#     validationresult = sut.validateAge(userid=None)
#     assert validationresult == expected

