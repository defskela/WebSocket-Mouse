from utemplate import recompile

_loader = None


def init_templates(template_dir='templates', loader_class=recompile.Loader):
    global _loader
    _loader = loader_class(None, template_dir)


def render_template(template, *args, **kwargs):
    """Render a template.

    :param template: The filename of the template to render, relative to the
                     configured template directory.
    :param args: Positional arguments to be passed to the render engine.
    :param kwargs: Keyword arguments to be passed to the render engine.

    The return value is an iterator that returns sections of rendered template.
    """
    if _loader is None:  # pragma: no cover
        init_templates()
    render = _loader.load(template)
    return render(*args, **kwargs)
