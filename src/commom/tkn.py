from typing import Union


class Token:
    def __init__(self, ttype: str, value: Union[str, int, float, None]) -> None:
        self.type = ttype
        self.value = value

    def __str__(self) -> str:
        return "Token({type}, {value})".format(type=self.type, value=repr(self.value))

    def __repr__(self) -> str:
        return self.__str__()
