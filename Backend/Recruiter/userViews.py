from django.shortcuts import redirect
from django.http import HttpResponse, HttpResponseRedirect, HttpRequest
from .links import client_data
from Recruiter.models import Member
import requests
from .serializers import *
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import *
from rest_framework.decorators import api_view, permission_classes,  renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
from rest_framework.permissions import AllowAny
from django.contrib.auth import login, logout
from django.forms.models import model_to_dict

def authenticate(request, member_json_info):
    try:
        member_login = Member.objects.get(enroll_no = member_json_info.get('student').get('enrolmentNumber'))
    except Member.DoesNotExist:
        member_login = Member(
                            username = member_json_info.get ('username'),
                            name = member_json_info.get('person').get('fullName'),
                            profile_pic = member_json_info.get('person').get('displayPicture'),
                            academic_year = member_json_info.get('student').get('currentYear'),
                            enroll_no = member_json_info.get('student').get('enrolmentNumber'),
                            college_joining_year = member_json_info.get('student').get('startDate')[:4]
                        )
        member_login.save()
    return member_login

def auto_login(request, member_json_info, from_para):
    if from_para == "new":
        member_login = authenticate(request, member_json_info)
        login(request, member_login)

    if from_para == "old":
        print("old")
        print(member_json_info)
        member_login = member_json_info

@api_view(('GET',))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))       
def enter(request):
    client_id = client_data['client_id']
    client_secret_key = client_data['client_secret_key']
    redirect_uri = 'http://127.0.0.1:8000/enter/'
    # redirect_uri = 'http://127.0.0.1:3000/login/'
    
    if str(request.GET['state']) == "member_allowed_sharing_info":
        code = request.GET['code']

    data = {
        'client_id': client_id,
        'client_secret': client_secret_key,
        'grant_type': 'authorization_code',
        'redirect_uri': redirect_uri,
        'code': code
    }

    url = 'https://channeli.in/open_auth/token/'
    access_data = requests.post(url,data)

    if access_data.status_code == 200:
        access_data_json = access_data.json()
        access_token = access_data_json['access_token']
        auth_header = {
            'Authorization': "Bearer " + access_token
        }

        url = "https://channeli.in/open_auth/get_user_data/"
        member_info = requests.get(url,headers = auth_header)
        member_json_info = member_info.json()
        if member_info.status_code == 200:
            member = False
            for role in member_json_info.get('person').get('roles'):
                    if role['role'] == "Maintainer":
                        member = True
            
            if member:
                print("called")
                member_login = auto_login(request, member_json_info, "new")


            else:
                return redirect("google.com")
        # else:
        #     return HttpResponse("Failed to get member data")

        else:
            return Response(
                {
                    'status': 'Failed to get member data',
                },
                status=status.HTTP_404_NOT_FOUND
            )
    else:
        # bad request
        return Response(
                {
                    'status': 'Failed to get data',
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    return redirect('http://127.0.0.1:3000/seasons/')

@api_view(('GET',))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def loginUser(request):
    if request.user.is_authenticated:
        member_json_info = model_to_dict(Member.objects.get(username = request.user.username)) 
        auto_login(request, member_json_info, "old")
        return Response(
                    {
                        'status': 'alreadyLoggedIn',
                    },
                    status = status.HTTP_202_ACCEPTED
                )
    return Response(
                    {
                        'status': 'loggedOut',
                    },
                    status = status.HTTP_401_UNAUTHORIZED
                )


def authorize(request):
    url = "https://channeli.in/oauth/authorise/?client_id=" + client_data['client_id'] + "&redirect_uri=http://127.0.0.1:8000/enter/&state=member_allowed_sharing_info"
    return HttpResponseRedirect(url)

@api_view(['GET'])
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
@permission_classes([AllowAny])
def checkStatus(request):
    print(request.user.is_authenticated)
    if request.user.is_authenticated:
        return Response({'status': 'loggedIn'}, status=status.HTTP_202_ACCEPTED)

    return Response({'status': 'loggedOut'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def logout_member(request):
    if request.user.is_authenticated:
        logout(request)
        return HttpResponse("Logged Out")
    return HttpResponse("Failed to log out")