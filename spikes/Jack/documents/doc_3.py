import re

def find_integers(string):
    pattern = r'\d+'  # Matches one or more digits
    integers = re.findall(pattern, string)
    return integers

string = "I have 10 apples and 5 oranges."
integers = find_integers(string)
print(integers)  # Output: ['10', '5']