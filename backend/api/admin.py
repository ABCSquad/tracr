from django.contrib import admin
from .models import Test

# Register your models here.

class TestAdmin(admin.ModelAdmin):
    list_display = ('title', 'description')

# Register your models here.

admin.site.register(Test, TestAdmin)