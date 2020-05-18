from ctypes import *
import math
import random
from flask import Flask, jsonify
import json
import time
import threading
from datetime import datetime
import requests

num_of_person_barnA = 0
num_of_person_barnB = 0
num_of_person_barnC = 0
current_time = ""

busy_barnA = ""
busy_barnB = ""
busy_barnC = ""

def sample(probs):
    s = sum(probs)
    probs = [a/s for a in probs]
    r = random.uniform(0, 1)
    for i in range(len(probs)):
        r = r - probs[i]
        if r <= 0:
            return i
    return len(probs)-1

def c_array(ctype, values):
    arr = (ctype*len(values))()
    arr[:] = values
    return arr

class BOX(Structure):
    _fields_ = [("x", c_float),
                ("y", c_float),
                ("w", c_float),
                ("h", c_float)]

class DETECTION(Structure):
    _fields_ = [("bbox", BOX),
                ("classes", c_int),
                ("prob", POINTER(c_float)),
                ("mask", POINTER(c_float)),
                ("objectness", c_float),
                ("sort_class", c_int)]


class IMAGE(Structure):
    _fields_ = [("w", c_int),
                ("h", c_int),
                ("c", c_int),
                ("data", POINTER(c_float))]

class METADATA(Structure):
    _fields_ = [("classes", c_int),
                ("names", POINTER(c_char_p))]

    

lib = CDLL("/home/ubuntu/darknet/libdarknet.so", RTLD_GLOBAL)
# lib = CDLL("libdarknet.so", RTLD_GLOBAL)
lib.network_width.argtypes = [c_void_p]
lib.network_width.restype = c_int
lib.network_height.argtypes = [c_void_p]
lib.network_height.restype = c_int

predict = lib.network_predict
predict.argtypes = [c_void_p, POINTER(c_float)]
predict.restype = POINTER(c_float)

set_gpu = lib.cuda_set_device
set_gpu.argtypes = [c_int]

make_image = lib.make_image
make_image.argtypes = [c_int, c_int, c_int]
make_image.restype = IMAGE

get_network_boxes = lib.get_network_boxes
get_network_boxes.argtypes = [c_void_p, c_int, c_int, c_float, c_float, POINTER(c_int), c_int, POINTER(c_int)]
get_network_boxes.restype = POINTER(DETECTION)

make_network_boxes = lib.make_network_boxes
make_network_boxes.argtypes = [c_void_p]
make_network_boxes.restype = POINTER(DETECTION)

free_detections = lib.free_detections
free_detections.argtypes = [POINTER(DETECTION), c_int]

free_ptrs = lib.free_ptrs
free_ptrs.argtypes = [POINTER(c_void_p), c_int]

network_predict = lib.network_predict
network_predict.argtypes = [c_void_p, POINTER(c_float)]

reset_rnn = lib.reset_rnn
reset_rnn.argtypes = [c_void_p]

load_net = lib.load_network
load_net.argtypes = [c_char_p, c_char_p, c_int]
load_net.restype = c_void_p

do_nms_obj = lib.do_nms_obj
do_nms_obj.argtypes = [POINTER(DETECTION), c_int, c_int, c_float]

do_nms_sort = lib.do_nms_sort
do_nms_sort.argtypes = [POINTER(DETECTION), c_int, c_int, c_float]

free_image = lib.free_image
free_image.argtypes = [IMAGE]

letterbox_image = lib.letterbox_image
letterbox_image.argtypes = [IMAGE, c_int, c_int]
letterbox_image.restype = IMAGE

load_meta = lib.get_metadata
lib.get_metadata.argtypes = [c_char_p]
lib.get_metadata.restype = METADATA

load_image = lib.load_image_color
load_image.argtypes = [c_char_p, c_int, c_int]
load_image.restype = IMAGE

rgbgr_image = lib.rgbgr_image
rgbgr_image.argtypes = [IMAGE]

predict_image = lib.network_predict_image
predict_image.argtypes = [c_void_p, IMAGE]
predict_image.restype = POINTER(c_float)

def classify(net, meta, im):
    out = predict_image(net, im)
    res = []
    for i in range(meta.classes):
        res.append((meta.names[i], out[i]))
    res = sorted(res, key=lambda x: -x[1])
    return res

def detect(net, meta, image, thresh=.5, hier_thresh=.5, nms=.45):
    im = load_image(image, 0, 0)
    num = c_int(0)
    pnum = pointer(num)
    predict_image(net, im)
    dets = get_network_boxes(net, im.w, im.h, thresh, hier_thresh, None, 0, pnum)
    num = pnum[0]
    if (nms): do_nms_obj(dets, num, meta.classes, nms);

    res = []
    for j in range(num):
        for i in range(meta.classes):
            if dets[j].prob[i] > 0:
                b = dets[j].bbox
                res.append((meta.names[i], dets[j].prob[i], (b.x, b.y, b.w, b.h)))
    res = sorted(res, key=lambda x: -x[1])
    free_image(im)
    free_detections(dets, num)
    return res

def busy_classifier(number):
    if (number > 15):
        return "very busy"
    elif (number > 10):
        return "busy"
    else:
        return "not busy"

def detect_thread(net, meta, imgA, imgB, imgC):
    while (True):
        global num_of_person_barnA
        global num_of_person_barnB
        global num_of_person_barnC

        global busy_barnA
        global busy_barnB
        global busy_barnC

        global current_time

        start_time = time.time()
        
        tempA = 0
        tempB = 0
        tempC = 0

        URLA = 'http://itsc.ust.hk/apps/realcam/barna_g1_000M.jpg'
        URLB = 'http://itsc.ust.hk/apps/realcam/barnb_1_000M.jpg'
        URLC = 'http://itsc.ust.hk/apps/realcam/barnc_g1_000M.jpg'

        img_dataA = requests.get(URLA).content
        img_dataB = requests.get(URLB).content
        img_dataC = requests.get(URLC).content

        with open('barn_A.jpg', 'wb') as handler:
            handler.write(img_dataA)
        print("Finished A")
        
        with open('barn_B.jpg', 'wb') as handler:
            handler.write(img_dataB)
        print("Finished B")

        with open('barn_C.jpg', 'wb') as handler:
            handler.write(img_dataC)
        print("Finished C")

        imgA = b"barn_A.jpg"
        imgB = b"barn_B.jpg"
        imgC = b"barn_C.jpg"


        now = datetime.now()
        start_time = now.strftime("%H:%M:%S")

        print("===Iteration: {}===".format(start_time))

        r = detect(net, meta, imgA)

        for i in range(len(r)):
            if ("person" in str(r[i][0])):
                print(r[i])
                tempA += 1
        # num_of_person_barnA = tempA

        r = detect(net, meta, imgB)

        for i in range(len(r)):
            if ("person" in str(r[i][0])):
                print(r[i])
                tempB += 1
        # num_of_person_barnB = tempB

        r = detect(net, meta, imgC)

        for i in range(len(r)):
            if ("person" in str(r[i][0])):
                print(r[i])
                tempC += 1
        # num_of_person_barnC = tempC


        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")

        num_of_person_barnA = tempA
        num_of_person_barnB = tempB
        num_of_person_barnC = tempC

        busy_barnA = busy_classifier(num_of_person_barnA)
        busy_barnB = busy_classifier(num_of_person_barnB)
        busy_barnC = busy_classifier(num_of_person_barnC)

        print("Number of person in barn A at {}: {}, {}".format(current_time, num_of_person_barnA, busy_barnA))
        print("Number of person in barn B at {}: {}, {}".format(current_time, num_of_person_barnB, busy_barnB))
        print("Number of person in barn C at {}: {}, {}".format(current_time, num_of_person_barnC, busy_barnC))

        # print("Time used for this iteration: {} second".format(s))
        time.sleep(60)

app = Flask(__name__)
@app.route('/head_count', methods=["GET"])
def head_count():
    # now = datetime.now()
    # current_time = now.strftime("%H:%M:%S")
    return jsonify(
        barn_a = [num_of_person_barnA, busy_barnA],
        barn_b = [num_of_person_barnB, busy_barnB],
        barn_c = [num_of_person_barnC, busy_barnC],
        time = current_time
        )

if __name__ == "__main__":
    #net = load_net("cfg/densenet201.cfg", "/home/pjreddie/trained/densenet201.weights", 0)
    #im = load_image("data/wolf.jpg", 0, 0)
    #meta = load_meta("cfg/imagenet1k.data")
    #r = classify(net, meta, im)
    #print r[:10]

    net = load_net(b"cfg/yolov3.cfg", b"yolov3.weights", 0)
    meta = load_meta(b"cfg/coco.data")

    img_barnA = b"data/barn_a.jpeg"
    img_barnB = b"data/barn_b.jpeg"
    img_barnC = b"data/barn_c.jpeg"

    # print("===New Iteration===")
    # r = detect(net, meta, b"data/barn_b.jpeg")
    # print(r)

    # for i in range(len(r)):
    #     if ("person" in str(r[i][0])):
    #         print(r[i])
    #         num_of_person_barnA += 1
    
    t1 = threading.Thread(target = detect_thread, args=(net, meta, img_barnA, img_barnB, img_barnC,))
    # t2 = threading.Thread(target = detect_thread_B, args=(net, meta, img_barnB,))
    # t3 = threading.Thread(target = detect_thread_C, args=(net, meta, img_barnC,))
    
    t1.start()
    # t2.start()
    # t3.start()

    app.run(debug=False,host='0.0.0.0')
    
