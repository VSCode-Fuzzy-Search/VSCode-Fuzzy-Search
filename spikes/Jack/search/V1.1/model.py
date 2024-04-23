import math

class BooleanSearchModel():
    def AND(left, right):
        res = []
        l_index = 0
        r_index = 0
        l_skip = int(math.sqrt(len(left)))
        r_skip = int(math.sqrt(len(right)))
        while l_index < len(left) and r_index < len(right):
            l_item = left[l_index]
            r_item = right[r_index]
            if l_item == r_item:
                res.append(l_item)
                l_index += 1
                r_index += 1
            elif l_item < r_item:
                if l_index + l_skip < len(left) and left[l_index + l_skip] <= r_item:
                    l_index += l_skip
                else:
                    l_index += 1
            else:
                if r_index + r_skip < len(right) and right[r_index + r_skip] <= l_item:
                    r_index += r_skip
                else:
                    r_index += 1
        return res
    
    def OR(left, right):
        res = []
        l_index = 0
        r_index = 0
        while l_index < len(left) or r_index < len(right):
            if l_index < len(left) and r_index < len(right):
                l_item = left[l_index]
                r_item = right[r_index]
                if l_item == r_item:
                    res.append(l_item)
                    l_index += 1
                    r_index += 1
                elif l_item < r_item:
                    res.append(l_item)
                    l_index += 1
                else:
                    res.append(r_item)
                    r_index += 1
            elif l_index < len(left):
                res.append(left[l_index])
                l_index += 1
            else:
                res.append(right[r_index])
                r_index += 1
        return res
    
    def ANDNOT(right, docs):
        res = []
        r_index = 0
        for doc in docs:
            if doc != right[r_index]:
                res.append(doc)
            elif r_index + 1 < len(right):
                r_index += 1

        return res

    def ORNOT(right, docs):
        res = []
        r_index = 0
        for doc in docs:
            if doc == right[r_index]:
                if r_index + 1 < len(right):
                    r_index += 1
            else:
                res.append(doc)
        return res

    def WILDCARD(left, docs):
        raise NotImplementedError("Wildcard search not implemented yet")
