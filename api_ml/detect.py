import torch
import pandas as pd
import numpy as np

from models.common import DetectMultiBackend
from utils.dataloaders import LoadImages
from utils.general import (Profile, check_img_size, cv2, non_max_suppression, scale_boxes, xyxy2xywh)
from utils.plots import Annotator, colors
from utils.torch_utils import select_device


def interpretation(v):
    """
    :param: v: pandas Dataframe that contains information got by Neural Vision

    This function parses pandas Dataframe given by Neural Vision and gets necessary information from it

    :return: array of necessary values that will be responsed to backend request
    """
    dial = v.loc[v.values == 'dial']
    v = v.drop(v[v['value'] == 'dial'].index)
    v = v.sort_values(by='x', ignore_index=True)
    square = []
    for index, row in v.iterrows():
        square.append(row['w'] * row['h'])
    max_value = -1
    pre_max_value = -1
    for num in square:
        if num > max_value:
            pre_max_value = max_value
            max_value = num
        elif num > pre_max_value and num != max_value:
            pre_max_value = num
    if pre_max_value != -1:
        if (pre_max_value * 1.3) < max_value:
            v = v.drop(square.index(max_value))
    v = v.append(dial, ignore_index=True)
    return v


def prediction(path_to_model, path_to_data, path_to_img, device='', coef=0.45, max_det=10):
    """
    :param: max_det: optional, int, def=10: how many values can NV get from picture
    :param: coef

    Neural Vision use to get pandas DF with rectangle coordinates with values in it.

    return: values given by interpretation func if success else prints "nothing"
    """
    values = pd.DataFrame(columns=['value', 'x', 'y', 'w', 'h', 'coef'])
    device = select_device(device)
    model = DetectMultiBackend(path_to_model, device=device, data=path_to_data, fp16=False)
    stride, names, pt = model.stride, \
        {0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: 'dial'}, \
        model.pt
    imgsz = check_img_size((640, 640), s=stride)
    dataset = LoadImages(path_to_img, img_size=imgsz, stride=stride,
                         auto=pt)

    model.warmup(imgsz=(1 if pt or model.triton else 1, 3, *imgsz))  # warmup
    seen, windows, dt = 0, [], (Profile(), Profile(), Profile())
    for path, im, im0s, vid_cap, s in dataset:
        with dt[0]:
            im = torch.from_numpy(im).to(model.device)
            im = im.float()  # uint8 to fp16/32
            im /= 255  # 0 - 255 to 0.0 - 1.0
            if len(im.shape) == 3:
                im = im[None]
        with dt[1]:
            pred = model(im)
        with dt[2]:
            pred = non_max_suppression(pred, coef, 0.45, None, False, max_det=max_det)
        im0, frame = im0s.copy(), getattr(dataset, 'frame', 0)
        for i, det in enumerate(pred):
            s += '%gx%g ' % im.shape[2:]  # print string
            gn = torch.tensor(im0.shape)[[1, 0, 1, 0]]  # normalization gain whwh
            annotator = Annotator(im0, line_width=2, example=str(names))
            if len(det):
                # Rescale boxes from img_size to im0 size
                det[:, :4] = scale_boxes(im.shape[2:], det[:, :4], im0.shape).round()

                # Print results
                for c in det[:, 5].unique():
                    n = (det[:, 5] == c).sum()  # detections per class
                    s += f"{n} {names[int(c)]}{'s' * (n > 1)}, "  # add to string
                # Write results
                for *xyxy, conf, cls in reversed(det):
                    xywh = (xyxy2xywh(torch.tensor(xyxy).view(1, 4)) / gn).view(-1).tolist()  # normalized xywh
                    x, y, w, h = xywh
                    line = [names[int(cls)], x, y, w, h, float(conf)]
                    values.loc[len(values)] = line
                    c = int(cls)  # integer class
                    label = f'{names[c]} {conf:.2f}'
                    annotator.box_label(xyxy, label, color=colors(c, True))
                    im0 = annotator.result()
                    cv2.imwrite('result.png', im0)
                return interpretation(values)
            else:
                return print('nothing')
