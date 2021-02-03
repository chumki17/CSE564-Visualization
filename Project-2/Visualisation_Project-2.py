
import json
import pandas as pd
import numpy as np
import random
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn import cluster, metrics
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.manifold import MDS
from sklearn.metrics import pairwise_distances
from flask import Flask, render_template, request, redirect, Response, jsonify


app = Flask(__name__)
app.debug = True
@app.route("/")
def index():
    return render_template("index.html")


df = pd.read_csv('College.csv')
list1 = ['Unnamed: 0', 'Private']
df = df.drop(list1, axis=1)
StandardScaler = StandardScaler()

def randomSampledData():
    return df.sample(frac=.25)

def no_of_clusters():
    # within cluster sum of squares
    wcss = []
    for i in range(1, 11):
        kmeans = KMeans(n_clusters=i, init='k-means++', max_iter=300, n_init=10, random_state=0)
        kmeans.fit(df)
        wcss.append(kmeans.inertia_)
    plt.plot(range(1, 11), wcss, "-o")
    plt.fill_between(range(1, 11), wcss, color='blue', alpha=0.2)
    plt.title('The Elbow Method')
    plt.xlabel('Number of clusters')
    plt.ylabel('WCSS')
    plt.show()
    return wcss


def stratified_data():
    kMean = cluster.KMeans(n_clusters=7, random_state=0)
    kMean.fit(df)
    df['Cluster'] = kMean.labels_
    stratified_data = pd.DataFrame()
    for i in range(1, 7):
        cluster_df = df.loc[df['Cluster'] == i]
        # length = len(cluster_df.index)
        stratified_data = stratified_data.append(cluster_df.sample(frac=.25))
    stratified_data = stratified_data.drop('Cluster', axis=1)
    return stratified_data


def toPercent(array):
    for i , val in enumerate(array):
        array[i] = array[i] * 100
    return array


def cumulative_sum(array):
    new_array = array.copy()
    for i, val in enumerate(new_array):
        if i != 0:
            new_array[i] = new_array[i] + new_array[i - 1]
    return new_array

def topPCAloadings_Original():
    list1 = ['Apps', 'Accept', 'Enroll','F.Undergrad','P.Undergrad','Terminal','Expend']
    new_df = df.drop(list1,axis = 1)
    pca = PCA(n_components=3)
    pca.fit_transform(new_df)
    loadings = pd.DataFrame(pca.components_.T, columns=['PC1', 'PC2', 'PC3'], index=new_df.columns)
    load= loadings.apply(np.square)
    load["Sum_of_Squares"]= load.apply(np.sum, axis=1)
    load = load.sort_values(by=['Sum_of_Squares'], ascending=False )
    top2PCA = list(zip(new_df.values[:,3], new_df.values[:,4], new_df.values[:,6]))
    return json.dumps(top2PCA)
    
def topPCAloadings_Random():
    list1 = ['Apps', 'Accept', 'Enroll','F.Undergrad','P.Undergrad','Terminal','Expend']
    new_df = df.drop(list1, axis = 1)
    random_data = new_df.sample(frac =.25)
    pca = PCA(n_components=3)
    pca.fit_transform(random_data)
    loadings = pd.DataFrame(pca.components_.T, columns=['PC1', 'PC2', 'PC3'], index=random_data.columns)
    load= loadings.apply(np.square)
    load["Sum_of_Squares"]= load.apply(np.sum, axis=1)
    load = load.sort_values(by=['Sum_of_Squares'], ascending=False )
    top2PCA = list(zip(random_data.values[:,3], random_data.values[:,4],random_data.values[:,6]))
    return json.dumps(top2PCA)


def topPCAloadings_Stratified():
    list1 = ['Apps', 'Accept', 'Enroll','F.Undergrad','P.Undergrad','Terminal','Expend']
    new_df = df.drop(list1,axis = 1)
    kMean = cluster.KMeans(n_clusters=7, random_state=0)
    kMean.fit(new_df)
    new_df['Cluster'] = kMean.labels_
    stratified_data = pd.DataFrame() 
    for i in range(1,7):
        cluster_df = new_df.loc[df['Cluster']==i]
        stratified_data = stratified_data.append(cluster_df.sample(frac=.25))
    stratified_data = stratified_data.drop('Cluster', axis =1)
    pca = PCA(n_components=3)
    pca.fit_transform(stratified_data)
    loadings = pd.DataFrame(pca.components_.T, columns=['PC1', 'PC2', 'PC3'], index=stratified_data.columns)
    load= loadings.apply(np.square)
    load["Sum_of_Squares"]= load.apply(np.sum, axis=1)
    load = load.sort_values(by=['Sum_of_Squares'], ascending=False )
    top2PCA = list(zip(stratified_data.values[:,3], stratified_data.values[:,4],stratified_data.values[:,6]))
    return json.dumps(top2PCA)




pca = PCA(n_components=17,random_state=0)

original_df = pca.fit_transform(StandardScaler.fit_transform(df))
PCA_Array = pca.explained_variance_ratio_
calculate_percent = toPercent(PCA_Array)
cumulative_sum_var = cumulative_sum(calculate_percent)

random_df = pca.fit_transform(StandardScaler.fit_transform(randomSampledData()))
PCA_Array_random = pca.explained_variance_ratio_
calculate_percent_random = toPercent(PCA_Array_random)
cumulative_sum_random = cumulative_sum(calculate_percent_random)

stratified_df = pca.fit_transform(StandardScaler.fit_transform(stratified_data()))
PCA_Array_stratified = pca.explained_variance_ratio_
calculate_percent_stratified = toPercent(PCA_Array_stratified)
cumulative_sum_stratified = cumulative_sum(calculate_percent_stratified)


col = ['PC1','PC2','PC3','PC4','PC5','PC6','PC7','PC8','PC9','PC10','PC11','PC12','PC13','PC14','PC15','PC16','PC17']


def random_top2_pca():
        PCA_data = list(zip(random_df[:,0], random_df[:,1]))
        return PCA_data

def stratified_top2_pca():
        PCA_data = list(zip(stratified_df[:,0], stratified_df[:,1]))
        return PCA_data

def original_top2_pca():
        PCA_data = list(zip(original_df[:,0], original_df[:,1]))
        return PCA_data

       
@app.route("/plotOriginalPCA", methods=['POST', 'GET'])
def plotOriginalPCA():
    if request.method == 'POST':
        varianceData = list(zip(col, calculate_percent, cumulative_sum_var))
        return json.dumps(varianceData)

@app.route("/plotRandomPCA", methods=['POST', 'GET'])
def plotRandomPCA():
    if request.method == 'POST':
        varianceData = list(zip(col, calculate_percent_random, cumulative_sum_random))
        return json.dumps(varianceData)

@app.route("/plotStratifiedPCA", methods=['POST', 'GET'])
def plotStratifiedPCA():
    if request.method == 'POST':
        varianceData = list(zip(col, calculate_percent_stratified, cumulative_sum_stratified))
        return json.dumps(varianceData)
        
@app.route("/plotTop2PCAOriginal", methods=['POST', 'GET'])
def plotTop2OriginalPCA():
    if request.method == 'POST':
        return json.dumps(original_top2_pca())

@app.route("/plotTop2PCARandom", methods=['POST', 'GET'])
def plotTop2RandomPCA():
    if request.method == 'POST':
        return json.dumps(random_top2_pca())

@app.route("/plotTop2PCAStratified", methods=['POST', 'GET'])
def plotTop2StratifiedPCA():
    if request.method == 'POST':
        return json.dumps(stratified_top2_pca())


mds_data = MDS(n_components=2, dissimilarity='precomputed')
stratified_MDS_euc = pairwise_distances(stratified_data(), metric='euclidean')
MDS_Euclidean_stratified = mds_data.fit_transform(stratified_MDS_euc)

random_MDS_euc = pairwise_distances(randomSampledData(), metric='euclidean')
MDS_Euclidean_random = mds_data.fit_transform(random_MDS_euc)

stratified_MDS_cor = pairwise_distances(stratified_data(), metric='correlation')
MDS_Correlation_stratified = mds_data.fit_transform(stratified_MDS_cor)

random_MDS_cor = pairwise_distances(randomSampledData(), metric='correlation')
MDS_Correlation_random = mds_data.fit_transform(random_MDS_cor)


@app.route("/plotMDSStratifiedEucledian",methods =['POST','GET'])
def plotMDSStratifiedEucledian():
    if request.method == 'POST':
        MDS = list(zip(MDS_Euclidean_stratified[:,0], MDS_Euclidean_stratified[:,1]))
        return json.dumps(MDS)

@app.route("/plotMDSRandomEucledian",methods =['POST','GET'])
def plotMDSRandomEucledian():
    if request.method == 'POST':
        MDS = list(zip(MDS_Euclidean_random[:,0], MDS_Euclidean_random[:,1]))
        return json.dumps(MDS)


@app.route("/plotMDSStratifiedCorrelation",methods =['POST','GET'])
def plotMDSStratifiedCorrelation():
    if request.method == 'POST':
        MDS = list(zip(MDS_Correlation_stratified[:,0], MDS_Correlation_stratified[:,1]))
        return json.dumps(MDS)

@app.route("/plotMDSRandomCorrelation",methods =['POST','GET'])
def plotMDSRandomCorrelation():
    if request.method == 'POST':
        MDS = list(zip(MDS_Correlation_random[:,0], MDS_Correlation_random[:,1]))
        return json.dumps(MDS)



@app.route("/plotScatterMatrixOriginal",methods =['POST','GET'])
def plotScatterMatrixOriginal():
    if request.method == 'POST':
        return topPCAloadings_Original()

@app.route("/plotScatterMatrixRandom",methods =['POST','GET'])
def plotScatterMatrixRandom():
    if request.method == 'POST':
        return topPCAloadings_Random()

@app.route("/plotScatterMatrixStratified",methods =['POST','GET'])
def plotScatterMatrixStratified():
    if request.method == 'POST':
        return topPCAloadings_Stratified()
