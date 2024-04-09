from typing import Union


class Vector:
    def __init__(self, num_rows: int) -> None:
        self.components = [0]*num_rows

    def get_component(self, index: int) -> int:
        return self.components[index]

    def get_length(self) -> int:
        return len(self.components)

    def set_component(self, index: int, value: Union[int, float]) -> None:
        self.components[index] = value

    def euclidean_length(self) -> float:
        run_sum = 0
        for component in self.components:
            run_sum += component ** 2
        return run_sum ** 0.5

    def add_zeros(self, new_size: int) -> None:
        current_length = self.get_length()
        num_new_zeros = new_size - current_length
        self.components += [0]*num_new_zeros

