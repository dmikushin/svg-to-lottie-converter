from typing import Optional
import typer
from pathlib import Path
import xml.etree.cElementTree as et
from core.svg import convert_svg_to_lottie
from core.svg import convert_svg_to_lottie_def

def is_svg(file_path: str):
    tag = None
    with open(file_path, "r") as f:
        try:
            for _, el in et.iterparse(f, ('start',)):
                tag = el.tag
                break
        except et.ParseError:
            pass
    return tag == '{http://www.w3.org/2000/svg}svg'

def convert_from_local_file(optimize: bool = False, file_path: str = "./file_copy.svg"):
    if (is_svg(file_path)):
        if not optimize:
            anim = convert_svg_to_lottie_def(file_path)
        else:
            anim = convert_svg_to_lottie(file_path)
        return anim
    else:
        error = {"success": False, "message": "Invalid file type"}
        return error

__app_name__ = "svgtolottie"
__version__ = "0.0.1"

app = typer.Typer()

@app.command()
def convert(
    file_path: str = typer.Option(
        None,
        "--local-file-path",
        "-lfp",
        help="Convert SVG to Lottie JSON from local file path.",
    ),
) -> None:
    anim = convert_from_local_file(False, file_path)
    typer.echo(f'{anim}')
    raise typer.Exit()
    return

def _version_callback(value: bool) -> None:
    if value:
        typer.echo(f"{__app_name__} v{__version__}")
        raise typer.Exit()

@app.callback()
def main(
    version: Optional[bool] = typer.Option(
        None,
        "--version",
        "-v",
        help="Show the application's version and exit.",
        callback=_version_callback,
        is_eager=True,
    )
) -> None:
    return