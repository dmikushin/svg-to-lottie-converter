from pathlib import Path
from core.svg import convert_svg_to_lottie
from core.svg import convert_svg_to_lottie_def

def is_svg(file_path):
    tag = None
    with open(file_path, "r") as f:
        try:
            for _, el in et.iterparse(f, ('start',)):
                tag = el.tag
                break
        except et.ParseError:
            pass
    return tag == '{http://www.w3.org/2000/svg}svg'

def create_local_file_def(optimize: bool = False, file_path: str):
    #try:
    #    suffix = Path(filePath).suffix
    #    with NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
    #        shutil.copyfileobj(file.file, tmp)
    #        tmp_path = Path(tmp.name)
    #        file.file.close()

    #        newfile = NamedTemporaryFile(delete=False, suffix=".svg")
            # newfilepath = Path(newfile.name)

    #    cairosvg.svg2svg(file_obj=open(tmp_path, 'rb'), write_to=newfile.name)

    #finally:
        # file.file.close()

    if (is_svg(file_path)):
        if not optimize:
            anim = convert_svg_to_lottie_def(str(newfile.name))
        else:
            anim = convert_svg_to_lottie(str(newfile.name))
        # an = json.loads(anim)

        newfilepath = newfile.name
        os.unlink(newfilepath)
        assert not os.path.exists(newfilepath)
        os.unlink(tmp_path)
        assert not os.path.exists(tmp_path)

        return anim
    else:
        error = {"success": False, "message": "Invalid file type"}
        return error

if __name__ == "__main__":
    uvicorn.run("svgtolottie:app", host="0.0.0.0", port=3000)