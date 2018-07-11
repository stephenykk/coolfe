echarts
---
echarts.init(dom, theme? , opt?);
echarts.connect(groupId or charts);
echarts.disconnect(groupId);
echarts.dispose(containerDiv);
echarts.getInstanceByDom(divEle);
echarts.registerTheme(themeName, theme);
echarts.registerMap(mapName, geoJson, specialArea?);
echarts.getMap(mapName);

echarts.graphic.clipPointsByRect(points, rect);
echarts.graphic.clipRectByRect(targetRect, rect);


> window.devicePixelRatio

echartInstance
---

mychart.group
mychart.setOption(option, notMerge, lazyUpdate);
mychart.setOption(option, opts={notMerge, lazyUpdate, silent});

mychart.getOption();
mychart.getWidth()
mychart.getHeight();
mychart.getDom();
mychart.resize(opts? = {width, height, silent});
mychart.dispatchAction(payload)
mychart.on(eventName, handler, context?);
mychart.off(eventName, handler?);
mychart.convertToPixel(finder, value);
mychart.convertFromPixel(finder, value);
mychart.containPixel(finder, value);

mychart.showLoading(type?, opts? = {text, color, textColor, maskColor, zlevel})
mychart.hideLoading();
mychart.getDataURL({pixelRatio, backgroundColor});
mychart.getConnectDataURL()
mychart.clear();
mychart.isDisposed()
mychart.dispose();





