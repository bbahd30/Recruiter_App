from dataclasses import field, fields
from rest_framework import serializers
from Recruiter.models import *

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['id', 'name', 'username', 'enroll_no', 'profile_pic', 'academic_year']

class SeasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Season
        fields = '__all__'
        depth = 1

class RoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Round
        fields = '__all__'

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    assignee_id = MemberSerializer(many = True, read_only = True)

    class Meta:
        model = Question
        fields = '__all__'
        depth = 1

class ApplicantSerializerImpData(serializers.ModelSerializer):
    class Meta:
        model = Applicant
        fields = ['id', 'name', 'enroll_no', 'role', 'project', 'projectLink','cg', 'status']

class ApplicantSerializerNormalData(serializers.ModelSerializer):
    class Meta:
        model = Applicant
        fields = ['id', 'name', 'enroll_no', 'role', 'project', 'projectLink', 'status']

class InterviewPanelSerializer(serializers.ModelSerializer):
    members = MemberSerializer(many = True, read_only = True)
    applicant_id = ApplicantSerializerImpData(many = True, read_only = True)
    class Meta:
        model = InterviewPanel
        fields = ['id', 'name', 'location', 'status', 'members', 'applicant_id']
        depth = 1

# class InterviewPanelSerializer(serializers.ModelSerializer):
#     members = MemberSerializer(many = True, read_only = True)
#     applicant_id = ApplicantSerializer(many = True, read_only = True)
#     class Meta:
#         model = InterviewPanel
#         fields = ['id', 'name', 'location', 'status', 'members', 'applicant_id']
#         depth = 1

class InterviewSerializer(serializers.ModelSerializer):
    interview_panel_id = InterviewPanelSerializer(many = True, read_only = True)
    class Meta:
        model = Interview
        fields = ['id', 'status', 'round_id', 'interview_panel_id']

class ScoreSerializer(serializers.ModelSerializer):
    student_id = ApplicantSerializerImpData(many = True, read_only = True)
    class Meta:
        model = Score
        fields = '__all__'
        fields = ['marks_awarded', 'remarks', 'status', 'question_id', 'student_id']       

class ScoreSerializerNormal(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = ['id', 'remarks', 'status', 'question_id', 'student_id']       
        depth = 1
