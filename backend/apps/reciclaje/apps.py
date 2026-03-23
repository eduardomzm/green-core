from django.apps import AppConfig


class ReciclajeConfig(AppConfig):
    name = 'apps.reciclaje'

    def ready(self):
        import apps.reciclaje.signals
