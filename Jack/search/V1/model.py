import math

class BooleanModel():
    """
    Boolean Model for Information Retrieval
    This implementation uses a simple binary tree to store the documents
    and a simple boolean query processing algorithm.

    The algorithm uses a skip pointer to speed up the merge operation.
    """

    def and_op(left_op, right_op):
        # perform merge
        result = []
        l_index = 0
        r_index = 0
        l_skip = int(math.sqrt(len(left_op)))  # skip pointer distance for l_index
        r_skip = int(math.sqrt(len(right_op))) # skip pointer distance for r_index

        while l_index < len(left_op) and r_index < len(right_op):
            l_item = left_op[l_index]
            r_item = right_op[r_index]

            # match
            if l_item == r_item:
                result.append(l_item)
                l_index += 1
                r_index += 1

            # l > r
            elif l_item < r_item:
                # skip pointer
                if l_index + l_skip < len(left_op) and left_op[l_index + l_skip] <= r_item:
                    l_index += l_skip
                else:
                    l_index += 1

            # l > r
            else:
                # skip pointer
                if r_index + r_skip < len(right_op) and right_op[r_index + r_skip] <= l_item:
                    r_index += r_skip
                else:
                    r_index += 1

        return result
    
    def or_op(left_op, right_op):
        result = [] #union
        l_index = 0
        r_index = 0

        while l_index < len(left_op) or r_index < len(right_op):
            if l_index < len(left_op) and r_index < len(right_op):
                l_item = left_op[l_index]
                r_item = right_op[r_index]
                if l_item == r_item:
                    result.append(l_item)
                    l_index += 1
                    r_index += 1
                elif l_item < r_item:
                    result.append(l_item)
                    l_index += 1
                else:
                    result.append(r_item)
                    r_index += 1
            elif l_index < len(left_op):
                result.append(left_op[l_index])
                l_index += 1
            else:
                result.append(right_op[r_index])
                r_index += 1

        return result
    

    def not_op(right_op, doc_ids):
        if not right_op:
            return doc_ids
        
        result = []
        r_index = 0
        for item in doc_ids:
            if item != right_op[r_index]:
                result.append(item)

            # move to next item in right_op
            elif r_index + 1 < len(right_op):
                r_index += 1
        
        return result