from django.shortcuts import render

from abslib.kp import KnowledgePatternManager, ConjunctKnowledgePatternItem, DisjunctKnowledgePatternItem, \
    QuantKnowledgePatternItem
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json


@csrf_exempt
def home(request):
    if request.method == 'POST':
        json_data = json.loads(request.body)
        try:
            dict_data = json_data['data']
            str_type = json_data['type']
        except KeyError:
            raise HttpResponse("Unable to download data.")

        # Test for KF's length
        key = 1
        while 2 ** key < len(dict_data):
            key += 1
        if len(dict_data) != 2 ** key:
            return HttpResponse(
                "Wrong type of data. The correct one is a stack with length 2^k for some natural k.")

        # Test for the range of probabilities and making the array
        arr_data = []
        key = 0
        print(dict_data)
        while str(key) in dict_data:
            if (float(dict_data[str(key)]['0']) > 1) or (float(dict_data[str(key)]['0']) < 0) or \
                    (float(dict_data[str(key)]['0']) > 1) or (float(dict_data[str(key)]['0']) < 0):
                return HttpResponse(
                    "Wrong type of data. The correct one is a stack of decimal numbers in range [0; 1].")
            arr_data.append([float(dict_data[str(key)]['0']), float(dict_data[str(key)]['1'])])
            key += 1
        print(arr_data)
        # Test for the 'type' field
        if str_type == 'conjuncts':
            pattern = ConjunctKnowledgePatternItem(arr_data)
        elif str_type == 'disjuncts':
            pattern = DisjunctKnowledgePatternItem(arr_data)
        elif str_type == 'quants':
            pattern = QuantKnowledgePatternItem(arr_data)
        else:
            return HttpResponse("Wrong type of data. The correct ones are conjuncts, disjuncts, and quants.")

        try:
            return JsonResponse({'consistent': KnowledgePatternManager.checkInconsistency(pattern).inconsistent,
                                 'data': KnowledgePatternManager.checkInconsistency(pattern).array})
        except AttributeError:
            return JsonResponse({'consistent': KnowledgePatternManager.checkInconsistency(pattern).inconsistent})

    else:
        return HttpResponse("Wrong request method: POST required.")


def index(request):
    return render(request, 'index.html')
