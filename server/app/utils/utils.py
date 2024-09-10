def update_if_not_none(instance, field, value):
    if value is not None:
        setattr(instance, field, value)
