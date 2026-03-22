from apps.users.models import User, Notificacion

# Tomar un usuario
user = User.objects.first()
if user:
    Notificacion.objects.create(
        usuario=user,
        titulo='¡Bienvenido a las Notificaciones!',
        mensaje='Este es un mensaje de prueba para verificar que el sistema universal funciona.',
        tipo='SUCCESS',
        enlace='/perfil'
    )
    print(f"Notificación creada para {user.username}")
else:
    print("No se encontraron usuarios")
