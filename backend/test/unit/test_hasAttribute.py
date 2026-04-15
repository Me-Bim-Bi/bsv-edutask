from src.util.helpers import hasAttribute
import pytest

@pytest.fixture
def obj():
    return {"name": "Jane"}

@pytest.mark.unit
def test_hasAttribute_true(obj):
    # print("He he he")
    result = hasAttribute(obj, "name")
    # print(result)
    assert result == True
    
@pytest.mark.unit    
def test_hasAttribute_false(obj):
    result = hasAttribute(obj, "name5")
    print(result)
    assert result == False
    
# @pytest.mark.unit    
# def test_hasAttribute_none():
#     result = hasAttribute(None, "name5")
#     assert result == False
