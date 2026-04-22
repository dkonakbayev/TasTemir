from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_fitnessclass_options_remove_profile_is_admin_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='fitnessclass',
            name='hall',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='fitnessclass',
            name='direction',
            field=models.CharField(choices=[('Boxing', 'Boxing'), ('Yoga', 'Yoga'), ('Strength', 'Strength'), ('Cycling', 'Cycling'), ('Pilates', 'Pilates'), ('Dance Fit', 'Dance Fit')], max_length=100),
        ),
    ]
